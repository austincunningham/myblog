# Running two Kubernetes Operators locally

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jvq1ntix4s683l515r7p.png)

From time to time you may wish to run two or more Kubernetes Operators locally for debugging purposes. If you try and run a second operator locally the second operator will shutdown you will hit an error like
```bash
WATCH_NAMESPACE=$(MY-OPERATOR-NAMESPACE) go run ./main.go
2022-01-07T15:16:11.786Z        INFO    controller-runtime.metrics      metrics server is starting to listen    {"addr": ":8383"}
2022-01-07T15:16:11.787Z        ERROR   controller-runtime.metrics      metrics server failed to listen. You may want to disable the metrics server or use another port if it is due to conflicts       {"error": "error listening on :8383: listen tcp :8383: bind: address already in use"}
```
So the metric port is already used.The [Operator SDK](https://sdk.operatorframework.io/) generates ports for metrics and health automatically. These are set in the main.go
 
```golang
func main() {
	var metricsAddr string
	var enableLeaderElection bool
	var probeAddr string
    //Change the port numbers on the metrics-bind-address and health-probe-bind-address to a free port number
	flag.StringVar(&metricsAddr, "metrics-bind-address", ":8383", "The address the metric endpoint binds to.")
	flag.StringVar(&probeAddr, "health-probe-bind-address", ":8081", "The address the probe endpoint binds to.")
```
As you can see there are two port assignments here `metrics-bind-address` and `health-probe-bind-address`. These ports will be occupied on your machine by the first operator you run. You should change both to a free port numbers if you wish to run a second operator side by side locally, otherwise you will get a port conflict. You should now be able to [debug](https://austincunningham.ddns.net/2021/operatorv1vscode) both operators at once while running locally. Operators built with an older version of the Operator-sdk won't have the health-probe port.  

> **NOTE:** Sometimes the Operator gets stuck shutting down and you have to release the ports manually by killing the stuck process
```bash
# Get the process on the port metric port e.g. 8383
netstat -ltnp | grep -w ':8383'
tcp6       0      0 :::8383   :::*  LISTEN      1480861/main
# kill the stuck process 
sudo kill -9 1480861
```