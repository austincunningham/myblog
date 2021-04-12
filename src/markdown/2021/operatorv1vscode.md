
# Debug Kubernetes Operator-sdk v1.0.0 locally using Vscode

![](https://cdn-images-1.medium.com/max/800/1*PBCFvUkbUCXt7dwPCY3C7Q.jpeg)


Wrote this some time ago [debug-kubernetes-operator-sdk-locally-using-vscode](https://austincunningham.ddns.net/2019/operatorvscode) but due to changes in the Operator-sdk it's not valid for version v1.0.0 and greater. 

Here are the Steps to get debug running with v1.0.0

Go to Run\Add Configuration

Select Go from environments

Select Go Launch package

![add go config](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/bskbqyyqf0a4amk87w0f.gif)

You should get the following launch.json

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch Package",
            "type": "go",
            "request": "launch",
            "mode": "debug",
            "program": "${workspaceFolder}"
        }
    ]
}
```

Add an env for WATCH_NAMESPACE and  the following args to the configuration so it looks like 

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch Package",
            "type": "go",
            "request": "launch",
            "mode": "debug",
            "program": "${workspaceFolder}",
            "env": {
                "WATCH_NAMESPACE": "your-operator-namespace",                
            },
            "args": [
                "--kubeconfig",
                "${workspaceFolder}/TMP_SA_KUBECONFIG",
            ]
        }
    ]
}
```

Debug should now work as expected

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ciihpoifjs6fv9ytveg5.gif)

Thanks goes to [Sergio Franco Garcia](https://github.com/sergioifg94) for sharing this with me. 


