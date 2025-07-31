# Deploying Ollama on Openshift with the Ollama Operator

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ygww6k9exujk26wkgx4j.png)

### Why Run Ollama on OpenShift?
Running Ollama on OpenShift gives you a scalable, centralized service that's ready for team collaboration and production workloads.

The Ollama Operator makes it incredibly easy to deploy and manage Ollama instances on a cluster. This guide will walk you through the process, from installing the operator to testing your deployed Ollama service.

### What is the Ollama Operator?

The Ollama Operator is designed to streamline the deployment and management of Ollama on Kubernetes and OpenShift clusters. It automates tasks like creating necessary resources, managing deployments, and ensuring your Ollama inference server is up and running.

You can find the ollama operator's repository [on github](https://github.com/opendatahub-io/llama-stack-k8s-operator/tree/odh).

## Install the Operator

First, let's install the Ollama Operator itself. This will create a new project/namespace (llama-stack-k8s-operator-system) for Ollama and then apply the operator's manifest.

```bash
oc apply -f https://raw.githubusercontent.com/llamastack/llama-stack-k8s-operator/main/release/operator.yaml
```
You should see output similar to this, indicating the creation of various Kubernetes resources:

```bash
namespace/llama-stack-k8s-operator-system created
customresourcedefinition.apiextensions.k8s.io/llamastackdistributions.llamastack.io created
serviceaccount/llama-stack-k8s-operator-controller-manager created
role.rbac.authorization.k8s.io/llama-stack-k8s-operator-leader-election-role created
clusterrole.rbac.authorization.k8s.io/llama-stack-k8s-operator-manager-role created
clusterrole.rbac.authorization.k8s.io/llama-stack-k8s-operator-metrics-reader created
clusterrole.rbac.authorization.k8s.io/llama-stack-k8s-operator-proxy-role created
rolebinding.rbac.authorization.k8s.io/llama-stack-k8s-operator-leader-election-rolebinding created
clusterrolebinding.rbac.authorization.k8s.io/llama-stack-k8s-operator-manager-rolebinding created
clusterrolebinding.rbac.authorization.k8s.io/llama-stack-k8s-operator-proxy-rolebinding created
configmap/llama-stack-k8s-operator-manager-config created
service/llama-stack-k8s-operator-controller-manager-metrics-service created
deployment.apps/llama-stack-k8s-operator-controller-manager created
```

This confirms that the operator has been successfully deployed to the llama-stack-k8s-operator-system namespace. 

### Run the Quickstart Script

Now that the operator is running, we can use a convenient quickstart script provided in the operator's repository to deploy an Ollama instance.

Clone the Repository
```bash
git clone https://github.com/opendatahub-io/llama-stack-k8s-operator.git
```

Navigate to the Repository Directory
```bash
cd llama-stack-k8s-operator
```

Execute the Quickstart Script `./hack/deploy-quickstart.sh`
The script will create a new namespace (ollama-dist) and deploy Ollama as a provider. It will also handle necessary OpenShift security context constraints (SCCs) if you're on OpenShift.

```bash
./hack/deploy-quickstart.sh
Checking if namespace ollama-dist exists...
Creating namespace ollama-dist...
namespace/ollama-dist created
Start deploying ollama as provider with configuration:
  ServingRuntime Image: ollama/ollama:latest
  Inference Server: ollama
  Model: llama3.2:1b
Checking if ServiceAccount ollama-sa exists...
Creating ServiceAccount ollama-sa...
serviceaccount/ollama-sa created
Checking if OpenShift prerequisites exist in namespace: ollama-dist for service account: ollama-sa...
Creating ollama-scc, ollama-scc-role and ollama-scc-rolebinding for ollama-sa
securitycontextconstraints.security.openshift.io/ollama-scc created
role.rbac.authorization.k8s.io/ollama-scc-role created
rolebinding.rbac.authorization.k8s.io/ollama-scc-rolebinding created
Annotating ServiceAccount to clarify that it uses ollama-scc...
serviceaccount/ollama-sa annotate
Creating ollama-server deployment and service with image: ollama/ollama:latest...
deployment.apps/ollama-server created
service/ollama-server-service created
This may take up to 5 minutes for the image to be pulled and container to start...
Waiting for deployment "ollama-server" rollout to finish: 0 of 1 updated replicas are available...
deployment "ollama-server" successfully rolled out
Deployment is ready!
ollama inference server is now running!
  Namespace: ollama-dist
  Service: ollama-server-service
  Port: 11434
Access at:
  http://ollama-server-service.ollama-dist.svc.cluster.local:11434
```

The script will wait for the ollama-server deployment to be ready, which may take a few minutes as the Ollama image (ollama/ollama:latest) and the llama3.2:1b model are pulled.

## Test the Ollama Service

Once the deployment is ready, you can test if Ollama is working correctly.

### Port Forward the Ollama Service

To access the Ollama service from your local machine, port-forward it:
```bash
oc port-forward -n ollama-dist svc/ollama-server-service 11434:11434
```
This command will forward local port 11434 to the Ollama service inside your cluster. You'll see output similar to:
```bash
Forwarding from [::1]:11434 -> 11434
Handling connection for 11434
Handling connection for 11434
```
Keep this command running in a separate terminal.

### Test the /api/tags Endpoint

Now, open another terminal and test the `/api/tags` endpoint to see the models available:

```bash
curl http://localhost:11434/api/tags
```
You should receive a JSON response showing the llama3.2:1b model that was deployed:
```json
{"models":[{"name":"llama3.2:1b","model":"llama3.2:1b","modified_at":"2025-07-31T09:31:39.9132431Z","size":1321098329,"digest":"baf6a787fdffd633537aa2eb51cfd54cb93ff08e28040095462bb63daf552878","details":{"parent_model":"","format":"gguf","family":"llama","families":["llama"],"parameter_size":"1.2B","quantization_level":"Q8_0"}}}]}
```

### Test the /api/generate Endpoint

Finally, let's test the `/api/generate` endpoint to interact with the model:
```bash
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.2:1b",
    "prompt": "Hello, how are you?",
    "stream": false
  }'
```
You should receive a JSON response showing the api chat response
```json
{"model":"llama3.2:1b","created_at":"2025-07-31T09:42:46.926734668Z","response":"I'm doing well, thank you for asking. Is there anything I can help you with or would you like to talk about something in particular?","done":true,"done_reason":"stop","context":[128006,9125,128007,271,38766,1303,33025,2696,25,6790,220,2366,18,271,128009,128006,882,128007,271,9906,11,1268,527,499,30,128009,128006,78191,128007,271,40,2846,3815,1664,11,9901,499,369,10371,13,2209,1070,4205,358,649,1520,499,449,477,1053,499,1093,311,3137,922,2555,304,4040,30],"total_duration":5444261976,"load_duration":2251218959,"prompt_eval_count":31,"prompt_eval_duration":734841277,"eval_count":30,"eval_duration":2457145861}
```
## Conclusion and Next Steps
You have successfully deployed a fully functional and scalable Ollama inference server on your OpenShift cluster. By using the Ollama Operator, you've bypassed complex manual setup and now have a robust service ready to be integrated into your projects.

So, what's next? Here are a few ideas to explore:

- **Try Different Models:** Explore the [Ollama model library](https://ollama.com/search) for other models. The quickstart deployed llama3.2:1b, but you can easily try others with the --provider and --model flags. e.g.  
```bash
./hack/deploy-quickstart.sh --provider ollama --model mistral:latest
```
> **NOTE:** llama3.2:1b is a small model other models may take longer to deploy

- **Expose Your Service:** Instead of using port-forward, create an OpenShift Route to expose your Ollama service with a public URL. This makes it accessible to external applications and users. You can do this with a simple command:

```bash
oc expose svc/ollama-server-service -n ollama-dist
```
- **Integrate with an Application:** Now that you have a stable API endpoint, connect it to your own applications. Whether it's a RAG (Retrieval-Augmented Generation) pipeline, a custom chatbot, or an automation script, your Ollama service is ready to power it.

- **Explore the Operator:** Dive deeper into the [Ollama Operator's documentation](https://github.com/opendatahub-io/llama-stack-k8s-operator/blob/odh/README.md) to understand its features, such as managing multiple models and custom configurations.