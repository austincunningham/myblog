
# Debug Kubernetes Operator-sdk locally in Goland

![](https://thepracticaldev.s3.amazonaws.com/i/4n0nt3dyb3k20u8h7d7x.png)



This is a follow on from this [article](https://austincunningham.ddns.net/2019/operatorvscode) setting up the operator-sdk debug in vscode. 

## Setup Goland to debug

The setup for Goland is pretty similar to Vscode.

Delve is a debug tool for golang, it can be downloaded here https://github.com/go-delve/delve/tree/master/Documentation/installation or by just using go
```bash
go get -u github.com/go-delve/delve/cmd/dlv 
```


In Goland go to `Run\Edit Configurations...`

![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/qf038nul6d8l4pe9yxze.png)

Click on the Plus symbol `+` and add `Go Remote` add a Name and click `Apply` the defaults are fine

![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/m7bjl80enlwc2kyz54zf.png)

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
Click on `Run\Debug 'whatYouCallYourGoRemote'`
 

Goland will start to debug and stop at your breakpoints.

![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/nvstfw858uifuqw2i7uv.gif)