# Agentic AI - Let Ollama Write and Run Your Python, A Local Code Generator

![](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/apw94e2ibvs3clf3l8e6.png)

Up until this point I have mostly used Ollama as an API that returned answers. I wanted a basic understanding of agentic AI. You give it a goal of creating code, point it at a folder under `~/repo`, and let a model on my machine write and run Python until the job looks done.

No cloud API keys, no burning tokens. Just [Ollama](https://ollama.com), a few Python files, and tool calling.

## What we are building

![flowchart](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/6q4ivtm0q7qs0yznw3gm.png)

You pass a task and a work directory. The agent talks to Ollama. When the model wants an action, it returns a **tool call**. Your code runs the matching Python function and sends the result back. Repeat until the model answers in plain text, or you hit a turn limit.

The model never opens files itself. It only *requests* actions. Your process executes them.

## Prerequisites

- Python 3.10+
- Ollama installed and running
- A tool-capable model (I use `llama3.1:8b`)
- The `ollama` Python package

```bash
ollama serve
ollama pull llama3.1:8b
pip install ollama
```

## Project layout

Four files keep the responsibilities clear:

| File | Role |
| --- | --- |
| `main.py` | CLI, work-dir prompt / `--dir`, starts the loop |
| `agent.py` | Chat loop, tool execution, fake tool-call handling |
| `tools.py` | Read / write / run, plus a soft `~/repo` path limit |
| `config.py` | Model name, iteration cap, system prompt |

## Config first (config.py)

In `config.py` I keep the knobs in one place. Which model, how many turns, and a system prompt that pushes the model toward *real* tool calls (more on that later).

```python
MODEL_NAME = "llama3.1:8b"
MAX_ITERATIONS = 15

SYSTEM_PROMPT = (
    "You are an autonomous local AI assistant with file tools. "
    "When creating or editing code, you MUST call write_local_file with the COMPLETE source in content. "
    "Never write empty files. Never create a placeholder file first. "
    "Always use relative filenames (for example 'calculator.py'). "
    "Do not invent absolute paths like /repo/.... "
    "Never describe or simulate tool calls in text, XML, JSON, or markdown — only use real tool calls. "
    "Keep calling tools until the task is actually done; then reply with a short plain-text summary."
)
```

>**NOTE:** That prompt is not decoration. Smaller local models love to *describe* a tool call in chat instead of returning one in the API field. The system prompt is the first line of defence against this behaviour.

## The tools (`tools.py`)

These are normal Python functions. Docstrings and type hints matter: the Ollama client turns them into tool schemas automatically.

I expose three actions the model can request.

### `read_local_file`

Lets the model inspect what is already on disk — useful after a write, or when fixing a file it created earlier. Errors come back as a string so the model can see them in the next turn.

```python
def read_local_file(filepath: str) -> str:
    """Reads and returns the contents of a local file.

    Args:
        filepath: The path to the file to read. Must be under ~/repo.
    """
    try:
        with open(_resolve_tool_path(filepath), "r") as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"
```

### `write_local_file`

Creates or overwrites a file with the full source in `content`. I reject empty bodies here — early on the model wrote `content: ""`, got a zero-byte file, “verified” it, and declared victory.

```python
def write_local_file(filepath: str, content: str) -> str:
    """Writes or overwrites text content to a local file.

    Args:
        filepath: Target filename or path. Must be under ~/repo.
        content: The text content to write inside the file. Must not be empty.
    """
    try:
        if content is None or not str(content).strip():
            return (
                "Error writing file: content is empty. "
                "Call write_local_file again with the full file source in content."
            )
        path = _resolve_tool_path(filepath)
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w") as f:
            f.write(content)
        return f"Successfully wrote file to {path} ({len(content)} bytes)"
    except Exception as e:
        return f"Error writing file: {str(e)}"
```

### `run_python_script`

Runs the file with `python3`, captures stdout/stderr, and enforces a 10s timeout. That is how the agent “checks its work” after a write. Interactive scripts (`input()`) and GUI `mainloop()` calls do not verify cleanly here.

```python
def run_python_script(filepath: str) -> str:
    """Executes a local Python file and returns STDOUT and STDERR.

    Args:
        filepath: The path to the Python file to run. Must be under ~/repo.
    """
    try:
        path = _resolve_tool_path(filepath)
        result = subprocess.run(
            ["python3", str(path)],
            capture_output=True,
            text=True,
            timeout=10,
            cwd=str(_work_dir),
        )
        return f"STDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
    except Exception as e:
        return f"Execution error: {str(e)}"
```

### Registration

The agent looks tools up by name when Ollama returns a tool call:

```python
REGISTERED_TOOLS = {
    "read_local_file": read_local_file,
    "write_local_file": write_local_file,
    "run_python_script": run_python_script,
}
```

### Soft path limits under `~/repo`

For the demo I resolve tool paths under `~/repo` and a chosen work directory. Relative names like `hello.py` land in that work dir. Absolute paths must stay under `~/repo`. Models sometimes invent `/repo/...`, so I map that onto `~/repo/...`.

```python
ALLOWED_ROOT = (Path.home() / "repo").resolve()
_work_dir = ALLOWED_ROOT

def _under_repo(path: Path) -> Path:
    resolved = path.expanduser().resolve()
    try:
        resolved.relative_to(ALLOWED_ROOT)
    except ValueError as exc:
        raise PermissionError(
            f"Path '{resolved}' is outside allowed root '{ALLOWED_ROOT}'."
        ) from exc
    return resolved
```

>**NOTE:** This is a convenience guard on **tool file paths**, not a security sandbox. A script started with `run_python_script` can still touch the rest of the system. Fine for a personal demo, do not treat it as isolation. Hardening this takes the simplicity out of the demo.

## The agent loop (`agent.py`)

This is the interesting bit: Thought → Action → Observation. 
- model reply from `ollama.chat` = thought / decision
- running the tool/tool_calls = action
- tool message (result) = observation

```python
# ollama api call
response = ollama.chat(
    model=MODEL_NAME,
    messages=messages,
    tools=tools_list,  # the Python functions from REGISTERED_TOOLS
)

message = response["message"]
messages.append(message)

tool_calls = message.get("tool_calls")
```


### What a *real* tool_calls look like

It is important that we get valid tool_calls back from the LLM's API, otherwise the agent will fail to function. When tool calling works, the useful data is not in `content`. It is in `tool_calls` array. Here `name` is the function from `tools.py` (for example `write_local_file`):

```json
{
  "message": {
    "role": "assistant",
    "content": "",
    "tool_calls": [
      {
        "function": {
          "name": "write_local_file",
          "arguments": {
            "filepath": "hello.py",
            "content": "print('hi')\n"
          }
        }
      }
    ]
  }
}
```

Then I look up the name and run it:

```python
for call in tool_calls:
    func_name = call["function"]["name"]
    func_args = call["function"]["arguments"]

    if func_name in REGISTERED_TOOLS:
        observation = REGISTERED_TOOLS[func_name](**func_args)
    else:
        observation = f"Error: Tool '{func_name}' is not registered."

    messages.append({
        "role": "tool",
        "name": func_name,
        "content": str(observation),
    })
```

That observation goes back into `messages` for the next Ollama turn. That is the whole agent idea in one paragraph.

### What a *fake* tool_call looks like

Sometimes the model skips `tool_calls` and pastes something into `content` instead:

```text
I'll create the file now.
<tool_call>
{"name": "write_local_file", "arguments": {"filepath": "hello.py", "content": "print('hi')"}}
</tool_call>
```

If you treat “no `tool_calls`” as “task complete,” you exit with nothing written. I hit that more than once.

So when there are no tool calls, I check whether the text *looks* like a fake one. If it does, I **nudge** (basically another prompt) instead of finishing:

```python
CONTINUE_NUDGE = (
    "That response was not a valid tool call. "
    "Call write_local_file now with the full file contents. "
    "Do not write empty content. Do not describe the tool call in text."
)

if not tool_calls:
    content = message.get("content") or ""
    if _looks_like_fake_tool_call(content):
        messages.append({"role": "user", "content": CONTINUE_NUDGE})
        continue  # next iteration; yes, this burns a turn

    print(f"\n[Agent Completed Task]:\n{content}")
    return
```

A nudge is just another user message in the history: “that was not valid, try again with a real tool call.” It increments the iteration counter like any other turn.

If there are no tool calls and the text is a normal summary, we stop. That is the happy path.

### Context pruning

Local models have limited context. I keep the system + original user message, then the last few turns:

```python
def prune_context(messages: list, max_history: int = 6) -> list:
    if len(messages) <= max_history + 2:
        return messages
    return messages[:2] + messages[-max_history:]
```

Aggressive, but it keeps demos from falling over on long tool transcripts.

## The CLI (`main.py`)

`main.py` is thin on purpose.

- Optional task argument (default: build a factors `calculator.py` and verify it)
- `--dir` for a folder under `~/repo`, or an interactive prompt
- Append a reminder that relative filenames resolve inside that work dir
- Call `run_agent_loop(task)`

```bash
python main.py --dir demos/hello 'Create hello.py that prints Hello and run it to verify.'
```

## Running it

The more detailed the prompt the more successful the outcome. Simple prompts like `make me a calculator` have no chance of success. Here is one for creating another type of calculator with a GUI that another LLM gave me.

```bash
cd ~/repo/python-agent
python main.py 'Single-file tkinter calculator with digit buttons 0-9, + - * / = C. Show expression and result. No matplotlib. Write calculator.py only. After writing, fix any syntax or import errors. Prefer a complete working file; do not rely on running mainloop in the test harness.'
```

You should see something like:

```bash
Files will be written under: /home/<user_name>/repo
Enter a directory under ~/repo for the program (relative path like 'demos/factorial', or absolute under ~/repo): calculator
Work directory: /home/<user_name>/repo/calculator
Starting agent with goal: Single-file tkinter calculator with digit buttons 0-9, + - * / = C. Show expression and result. No matplotlib. Write calculator.py only. After writing, fix any syntax or import errors. Prefer a complete working file; do not rely on running mainloop in the test harness.

[Iter 1] Executing Tool: write_local_file({'content': "import tkinter as tk\n...", 'filepath': 'calculator.py'})
  -> Successfully wrote file to ... (N bytes)

[Agent Completed Task]:
This is a complete working single-file tkinter calculator with digit buttons 0-9, + - * / = C. The expression and result are shown in the entry field at the top. The 'C' button clears the entry field.
```

This project only creates Python, because that is all `run_python_script` can execute. After the agent completes the task, run the app yourself:

```bash
cd ~/repo/calculator
python calculator.py
```

You get a somewhat working calculator:

![Calculator UI](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/qox99m789sobcqhau6xl.png)

I have run this a number of times and the outcome is always different. Sometimes it works and sometimes it does not.

My key takeaway from this is agentic AI is a coding pattern based on your tooling and feedback from an LLM.

Code lives at [https://github.com/austincunningham/python-agent](https://github.com/austincunningham/python-agent).


