# Debug Kubernetes Operator-sdk Locally Using Vscode

![](https://cdn-images-1.medium.com/max/800/1*PBCFvUkbUCXt7dwPCY3C7Q.jpeg)
---

I recently got started with Kubernetes Operators on Openshift 4.1 . A lot of lessons learned but have more to learn.

## What are Operators
Kubernetes Operator are a way of leveraging the Kubernetties API to create your own Kubernetes custom resources.

The project I am working on [Integreatly](https://github.com/integr8ly/integreatly-operator) is using the [Operator-sdk](https://github.com/operator-framework/operator-sdk) framework to build operators, this takes some of the complexity out of building a Kubernetes Operators. 

I won't go into the installing of an operator that's documented in the Operator-sdk [docs](https://github.com/operator-framework/operator-sdk#create-and-deploy-an-app-operator).

## Running Locally
You can run the operator-sdk locally, and point it at the namespace for your operator 
```bash
operator-sdk up local --namespace=integreatly-operator
```
> *NOTE*: command changed with v0.15.0 `operator-sdk run --local --namespace=integreatly-operator`

![](https://cdn-images-1.medium.com/max/800/1*x6u0-nf6g6hYKI0_q4JIcQ.gif)

What this means that instead of having to build a container image and push it to a app registry like quay.io or dockerhub.com, you can just use your local code base as the source instead of a container image and use it to deploy your operator to your Openshift 4 cluster. 

## Setup Vscode to Debug

I use Vscode so how do I debug using `operator-sdk up local`? 

Delve is a debug tool for golang, it can be downloaded [here](https://github.com/go-delve/delve/tree/master/Documentation/installation) or by just using go
```bash
go get -u github.com/go-delve/delve/cmd/dlv 
```
Delve is used by default by this [Vscode Go plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode.Go)

You need to run delve with the command line switch `--enable-delve` on the `up local` command
e.g. The operator I am working on is called `integreatly-operator` so the commands to run it are as follows
```bash
# You need to set the namespace to watch 
$ export WATCH_NAMESPACE=integreatly-operator
# You can then run the up local with delve enabled
$ operator-sdk up local --namespace=integreatly-operator --enable-delve
# you will see something like
INFO[0000] Running the operator locally.                
INFO[0000] Using namespace integreatly-operator.        
INFO[0000] Delve debugger enabled with args [--listen=:2345 --headless=true --api-version=2 exec build/_output/bin/integreatly-operator-local --] 
API server listening at: [::]:2345
```

>**NOTE**: `WATCH_NAMESPACE` should always point to the namespace for your operator

You will need a launch json for Vscode to interact with this headless mode of delve

```json
{
    "version": "0.2.0",
    "configurations": [
      {
        "name": "Integreatly Operator",
        "type": "go",
        "request": "launch",
        "mode": "auto",
        "program": "${workspaceFolder}/cmd/manager/main.go",
        "env": {
          "WATCH_NAMESPACE": "integreatly-operator"
        },
        "args": []
      }
    ]
  }
```

Start the vscode debugger. Open the `Debug console` and you will see the standard output from the `operator-sdk up local` command, Your debugger will stop on the set breakpoints.

![](https://cdn-images-1.medium.com/max/800/1*E_VEwnyg_3RqnQPV2nzJjw.gif)