# AI-Powered Kubernetes Debugging with Python and Ollama

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ych0mu33kmfdbt0k8hat.png)

More playing around with AI development. Decided to see if I could build something useful. As I work with Kubernetes I thought I would build some sort of pod troubleshooter. 

## What It Does

This script does the heavy lifting in Kubernetes pod debugging:

1. Scans a namespace for failing pods  
2. Collects diagnostics: `describe`, `logs`, and `events`  
3. Sends the info to [Ollama](https://ollama.com) running `llama3`  
4. Displays a full AI-generated root cause analysis  

## Requirements

- Python 3.9+
- [`rich`](https://github.com/Textualize/rich)
- [`requests`](https://docs.python-requests.org/)
- [`kubectl`](https://kubernetes.io/docs/tasks/tools/)
- [Ollama](https://ollama.com) with `llama3` model

#### Install dependencies
```bash
pip install rich requests
```

#### Install and Start Ollama
```bash
curl -fsSL https://ollama.com/install.sh | sh
```
```bash
ollama pull llama3
ollama run llama3
```

# How It Works

First we pull in the imports and create a helper function to handle shell commands in string format 
```python
import argparse
import subprocess
import json
import requests
from rich.console import Console
from rich.panel import Panel

# Initialize rich  
console = Console()

def run_command(command):
    """
    Runs a shell command. If the command succeeds, it returns stdout.
    If it fails with a CalledProcessError (like a normal kubectl error),
    it returns stderr so the AI can analyze the error message.
    For other exceptions, it prints an error and returns an error string.
    """
    try:
        # Using shell=True for simplicity, but be cautious with untrusted input. Not sanitizing command line input here.  
        result = subprocess.run(
            command,
            shell=True,
            check=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        # This is an expected failure (e.g., `logs --previous` on a new pod).
        # We return the error message for the AI to analyze.
        return e.stderr
    except Exception as e:
        # For any other kind of error, log it and return a failure message.
        # This prevents the whole script from crashing.
        error_message = f"An unexpected error occurred running command: {command}\nError: {e}"
        console.print(f"[bold red]{error_message}[/bold red]")
        return error_message
```

#### Finding Failing Pods
Next we create a function for Finding Failing Pods

```python
def get_failing_pods(namespace):
    """Finds all pods in a namespace that are not in a 'Running' or 'Succeeded' state."""
    console.print(f"\n[bold cyan]🔍 Searching for failing pods in namespace '{namespace}'...[/bold cyan]")
    command = f"kubectl get pods -n {namespace} -o json"
    pods_json_str = run_command(command)

    if not pods_json_str:
        console.print(f"[bold red]Could not fetch pods in namespace '{namespace}'. No output received.[/bold red]")
        return []

    try:
        pods_data = json.loads(pods_json_str)
    except json.JSONDecodeError:
        console.print(f"[bold red]Failed to parse JSON output from kubectl for namespace '{namespace}'.[/bold red]")
        # The output might be an error message from kubectl
        console.print(f"Received: {pods_json_str}")
        return []

    failing_pods = []
    for pod in pods_data.get("items", []):
        pod_name = pod.get("metadata", {}).get("name")
        phase = pod.get("status", {}).get("phase")

        # Pod phase is not Running, Succeeded, or Completed
        if phase not in ["Running", "Succeeded"]:
            failing_pods.append(pod_name)
            continue

        # Pod phase is Running, but its containers are not ready or have crashed.
        if phase == "Running":
            container_statuses = pod.get("status", {}).get("containerStatuses", [])
            if not container_statuses:
                # A running pod should have container statuses. If not, it's an issue.
                failing_pods.append(pod_name)
                continue

            for container in container_statuses:
                # If any container is not ready, the pod is considered failing.
                if not container.get("ready", False):
                    failing_pods.append(pod_name)
                    break  # Found a failing container, no need to check others in this pod.

                # Explicitly check for terminated state with non-zero exit code
                terminated_state = container.get("state", {}).get("terminated")
                if terminated_state and terminated_state.get("exitCode", 0) != 0:
                    failing_pods.append(pod_name)
                    break

    # Remove duplicates that might occur if a pod is both 'not ready' and has other issues.
    return sorted(list(set(failing_pods)))
```

The script runs:

```bash
kubectl get pods -n <namespace> -o json
```

It filters out pods not in `"Running"` or `"Succeeded"` phase, and checks:

- Missing or unhealthy container statuses
- Containers not `ready`
- Terminated containers with non-zero exit codes

#### Collect Diagnostics
Next we Collect Diagnostics

```python
def get_pod_diagnostics(pod_name, namespace="default"):
    """Gathers describe, logs, and events for a given pod."""
    console.print(f"[bold cyan]🔍 Gathering diagnostics for pod '{pod_name}' in namespace '{namespace}'...[/bold cyan]")

    diagnostics = {}
    # Get pod  description
    diagnostics["describe"] = run_command(f"kubectl describe pod {pod_name} -n {namespace}")

    # Get pod logs (including previous container if it crashed)
    diagnostics["logs"] = run_command(f"kubectl logs {pod_name} -n {namespace} --all-containers=true")
    diagnostics["previous_logs"] = run_command(
        f"kubectl logs {pod_name} -n {namespace} --all-containers=true --previous")

    # Get relevant events in the namespace
    uid_command = f"kubectl get pod {pod_name} -n {namespace} -o jsonpath='{{.metadata.uid}}'"
    pod_uid = run_command(uid_command).strip()
    if pod_uid and 'error' not in pod_uid.lower():
        diagnostics["events"] = run_command(
            f"kubectl get events -n {namespace} --field-selector involvedObject.uid={pod_uid}")
    else:
        diagnostics["events"] = "Could not retrieve pod UID to filter events."

    return diagnostics
```

For each failing pod, it gathers:

```bash
kubectl describe pod <pod-name> -n <namespace>
kubectl logs <pod-name> -n <namespace> --all-containers
kubectl logs <pod-name> -n <namespace> --all-containers --previous
```
And also filters relevant events:
```bash
kubectl get events -n <namespace> --field-selector involvedObject.uid=<uid>
```
#### Analyze with Ollama
Next we create a AI prompt with the diagnostic data and pass it to Ollama that is running locally 
```python
def analyze_with_ollama(diagnostics, pod_name):
    """Sends diagnostics to Ollama for analysis and streams the response."""
    console.print(f"[bold cyan]🧠 Analyzing diagnostics for '{pod_name}' with Ollama...[/bold cyan]")

    prompt = f"""
You are an expert Kubernetes Site Reliability Engineer (SRE). Your task is to diagnose a failing pod based on the following `kubectl` outputs.

Analyze the provided data and perform the following steps:
1.  **Identify the Root Cause:** State the most likely root cause of the problem in a single, concise sentence.
2.  **Provide a Detailed Explanation:** Explain your reasoning. Reference specific lines from the logs, events, or pod description to support your conclusion.
3.  **Suggest a Next Step:** Recommend a single, concrete `kubectl` command or action for the user to take next to fix or further investigate the issue.

Here is the diagnostic information:

---
### 1. KUBECTL DESCRIBE POD:
{diagnostics.get('describe', 'Not available')}
---
### 2. KUBECTL LOGS (Current Container):
{diagnostics.get('logs', 'Not available')}
---
### 3. KUBECTL LOGS (Previous Container):
{diagnostics.get('previous_logs', 'Not available')}
---
### 4. KUBECTL GET EVENTS:
{diagnostics.get('events', 'Not available')}
---

Provide your analysis in a clear, easy-to-read format.
"""

    # Use a Panel to visually separate the analysis for each pod
    panel = Panel(f"[italic]Waiting for AI response for [bold]{pod_name}[/bold]...[/italic]",
                  title=f"[bold green]AI Diagnosis for {pod_name}[/bold green]", border_style="green")
    console.print(panel)

    full_response = ""
    try:
        with requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "llama3",
                    "prompt": prompt,
                    "stream": True
                },
                stream=True,
                timeout=300
        ) as response:
            response.raise_for_status()

            console.print(f"\n[bold green]AI Analysis for {pod_name}:[/bold green]")
            for line in response.iter_lines():
                if line:
                    chunk = json.loads(line)
                    content = chunk.get("response", "")
                    full_response += content
                    console.print(content, end="", style="white")
                    if chunk.get("done"):
                        console.print()
                        break
        return full_response

    except requests.exceptions.RequestException as e:
        console.print(f"\n[bold red]Error connecting to Ollama API: {e}[/bold red]")
        console.print("Please ensure Ollama is running and the 'llama3' model is available (`ollama pull llama3`).")
        return None

```
It streams this prompt to Ollama's local API running the `llama3` model and prints the response.

#### Bring it all together
In the main function we 
- setup the prompt 
- handle the namespace arguments. 
- We then call the `get_failing_pods(namespace)` function to find the failing pods 
- We then call `get_pod_diagnostics(pod_name, namespace)` to get the kubectl diagnostic information
- Finally we call `analyze_with_ollama(pod_diagnostics, pod_name)` to pass in the diagnostic data and build the AI prompt and query the AI(ollama) api endpoint for answers. 

```python
if __name__ == "__main__":
    console.print(f"[bold cyan]888      .d8888b.                     888                888 [/bold cyan] ")
    console.print(f"[bold cyan]888     d88P  Y88b                    888                888 [/bold cyan]")
    console.print(f"[bold cyan]888     Y88b. d88P                    888                888 [/bold cyan]")
    console.print(f"[bold cyan]888  888 \"Y88888\" .d8888b         .d88888 .d88b.  .d8888b888888 .d88b. 888d888\" [/bold cyan]")
    console.print(f"[bold cyan]888 .88P.d8P\"\"Y8b.88K            d88\" 888d88\"\"88bd88P\"   888   d88\"\"88b888P\" [/bold cyan]")
    console.print(f"[bold cyan]888888K 888    888\"Y8888b.888888 888  888888  888888     888   888  888888 [/bold cyan]")
    console.print(f"[bold cyan]888 \"88bY88b  d88P     X88       Y88b 888Y88..88PY88b.   Y88b. Y88..88P888 [/bold cyan]")
    console.print(f"[bold cyan]888  888 \"Y8888P\"  88888P\'        \"Y88888 \"Y88P\"  \"Y8888P \"Y888 \"Y88P\" 888    [/bold cyan] ")
    console.print(" ")
    parser = argparse.ArgumentParser(
        description="AI-powered Kubernetes Pod Troubleshooter.",
        formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument("-n", "--namespace", help="The namespace to inspect.")

    args = parser.parse_args()

    namespace = args.namespace
    if not namespace:
        namespace = console.input("[bold yellow]Please enter the Kubernetes namespace: [/bold yellow]")
        if not namespace:
            console.print("[bold red]Namespace cannot be empty. Exiting.[/bold red]")
            exit(1)

    # Automatically find all failing pods
    failing_pods = get_failing_pods(namespace)

    if not failing_pods:
        console.print(f"[bold green]✅ No failing pods found in namespace '{namespace}'.[/bold green]")
        exit(0)

    console.print(f"[bold yellow]Found {len(failing_pods)} failing pod(s): {', '.join(failing_pods)}[/bold yellow]")

    # Loop through each failing pod and diagnose it
    for pod_name in failing_pods:
        pod_diagnostics = get_pod_diagnostics(pod_name, namespace)
        if pod_diagnostics:
            analyze_with_ollama(pod_diagnostics, pod_name)
            console.print("-" * 80)  # Separator for clarity
```


### Running the script

```bash
python k8s-doctor.py -n my-namespace
```

If you omit `-n`, the script will prompt you to enter a namespace interactively.
![screenshot of interactive prompt](https://github.com/austincunningham/k8s-doctor/raw/master/img/k8s-doctor.png)

## Code lives here

> View the full Python script on [GitHub](https://github.com/austincunningham/k8s-doctor) 

To summarize I am using this script to automate log/event gathering for failed pods, creating a prompt for an AI LLM and returning a response from AI. Is this a wrapper for AI? Is this automation? a bit of both I think.
