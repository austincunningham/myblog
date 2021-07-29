
# Get Prometheus Metrics from a Express.js app
![banner image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2wgqholbtjqe661gavan.png)


## Expose the metrics in Express.js app
I use Prometheus all the time for metrics and alert monitoring in Kubernetes. I decided to see how to setup monitoring in a Node/Express.js app. A quick search of npmjs and I found these two package [prom-client](https://www.npmjs.com/package/prom-client) a really detailed Prometheus client and [express-prom-bundle](https://www.npmjs.com/package/express-prom-bundle) which uses `prom-client` under the hood, I choose `express-prom-bundle` as it was a quick win and was producing metrics with a few lines of code, my repo is [here](https://github.com/austincunningham/express-prometheus). I installed the following packages in my express app
```bash
npm install prom-client express-prom-bundle --save
```
Then added the Prometheus middleware to all routes
```js
const express = require('express');
const app = express();
const promBundle = require("express-prom-bundle");

// Add the options to the prometheus middleware most option are for http_request_duration_seconds histogram metric
const metricsMiddleware = promBundle({
    includeMethod: true, 
    includePath: true, 
    includeStatusCode: true, 
    includeUp: true,
    customLabels: {project_name: 'hello_world', project_type: 'test_metrics_labels'},
    promClient: {
        collectDefaultMetrics: {
        }
      }
});
// add the prometheus middleware to all routes
app.use(metricsMiddleware)

// default endpoint 
app.get("/",(req,res) => res.json({
    "GET /": "All Routes", 
    "GET /hello": "{hello:world}", 
    "GET /metrics": "Metrics data",
    "POST /bye": "POST Request: + post data"
}));
// hello world rest endpoint 
app.get("/hello", (req,res) => res.json({hello:"world"}));
app.post("/bye", (req,res) => res.send("POST Request : "+ req));

app.listen(8080, function () {    
    console.log('Listening at http://localhost:8080');  
  });
```
Running the app
```bash
npm start
> express-prometheus@1.0.0 start /home/austincunningham/repo/express-prometheus
> node index.js

Listening at http://localhost:8080

# curl the hello world endpoint
curl localhost:8080/hello
{"hello":"world"}%                                                                                                     

# curl the metrics endpoint
curl localhost:8080/metrics
# HELP process_cpu_user_seconds_total Total user CPU time spent in seconds.
# TYPE process_cpu_user_seconds_total counter
process_cpu_user_seconds_total 0.120868
# I cut the metrics output short here as its a lot of text but you get the idea
```
## Setup the Express app on Openshift
I am using [crc](https://access.redhat.com/documentation/en-us/red_hat_codeready_containers/1.0/html/getting_started_guide/getting-started-with-codeready-containers_gsg) which is local Kubernetes development environment based on Red Hat Openshift. I create a container for the app based on the following DockerFile
```
# syntax=docker/dockerfile:1

FROM node:12.18.1

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . .

CMD [ "node", "index.js" ]
```
I then build, test the image locally and push the image
```bash
docker build -t quay.io/austincunningham/express-prometheus:v1.0.0 .
docker run -p 8080:8080 quay.io/austincunningham/express-prometheus:v1.0.0
Listening at http://localhost:8080
docker push quay.io/austincunningham/express-prometheus:v1.0.0
```
I can then deploy this on crc/openshift with the following two files
**deployment.yaml**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: example-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: example-app
  template:
    metadata:
      labels:
        app: example-app
    spec:
      containers:
      - name: example-app
        image: quay.io/austincunningham/express-prometheus:v1.0.0
        ports:
        - name: web
          containerPort: 8080
```
**service.yaml**
```yaml
kind: Service
apiVersion: v1
metadata:
  name: example-app
  labels:
    app: example-app #--> this is used for scraping the service via the serviceMonitor
spec:
  selector:
    app: example-app
  ports:
  - name: web
    port: 8080
```
Apply the files to the default project
```bash
oc project default
oc apply -f deployment.yaml
oc apply -f service.yaml 
service/example-app created
# create a route to the service so you can access from the browser
oc expose service example-app 
route.route.openshift.io/example-app exposed
```
You can test the route by hitting the /metrics path in the browser you should see
![metrics screen shot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w20ytvf0lzemd7j6x86q.png)

## Setup Prometheus Operator on Openshift
I am following the [prometheus operator getting started guide](https://github.com/prometheus-operator/prometheus-operator/blob/master/Documentation/user-guides/getting-started.md). Applied the bundle from the setup on the default namespace
```bash
oc project default
oc apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/master/bundle.yaml
```
>*NOTE*: Hit a issue where the prometheus-operator pod was in a crash loop backoff :(   

Openshift has an operator hub so I did the following to fix the crashing operator pod. First I deleted the existing prometheus-operator deployment
```bash
oc delete deployment prometheus-operator
```
Logged in to crc/Openshift console as kubeadmin, in the administrator view go to OperatorHub and search for prometheus
![administrator view go to operator hub and search for prometheus](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a1jcm9lxb72ios6nwbe9.png)
Select the `Prometheus Operator` tile and `continue` then select `install` button
![Install Prometheus button](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3t4bab24d4pwj2oddo2a.png)
Select the default namespace from the drop down and install button again
![Install Prometheus button](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ov7novmbck4f30fo0vf1.png)

Phew! that took longer to explain that to do. 

## Steps to get Prometheus to see the Express.js apps metrics

First we add the Prometheus CR(custom resource) to the default namespace to start the Prometheus instance 
**prometheus.yaml**
```yaml
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: prometheus
spec:
  serviceAccountName: prometheus
  serviceMonitorSelector:
    matchLabels:
      team: frontend # --> this is used by prometheus to scrape the serviceMonitor
  resources:
    requests:
      memory: 400Mi
  enableAdminAPI: false
```
And add the service
**prometheus-service.yaml** 
```yaml
kind: Service
apiVersion: v1
metadata:
  name: prometheus-operated
  namespace: default
  labels:
    operated-prometheus: 'true'
spec:
  ports:
    - name: web
      protocol: TCP
      port: 9090
      targetPort: web
  selector:
    app: prometheus
```
Apply the files and create a route
```bash
oc apply -f prometheus.yaml
oc apply -f prometheus-service.yaml
oc expose service prometheus-operated
```
The way Prometheus scrapes metrics is that it uses a service monitor to check a `service` for a particular label. We have already created the service when we deployed the example-app with the label `app: example-app` in metadata.labels.

Next we create a serviceMonitor in the default namespace and with a `selector` for the `app: example-app` label. So we create the following file.
**service-monitor.yaml**
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: example-app
  labels:
    team: frontend # --> this should match the serviceMonitorSelector in the prometheus CR
spec:
  selector:
    matchLabels:
      app: example-app # --> this should match the label in the service in example-app
  endpoints:
  - port: web
```
> **NOTE** metadata.labels `team: frontend` we will use this later.

We upload the service-monitor.yaml file to the default namespace to create the serviceMonitor
```bash
oc apply -f service-monitor.yaml
```

In the prometheus.yaml CR we have already selected the service monitor this is done via `serviceMonitorSelector` label with the label `team: frontend` 

Finally we need some [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) rules which is Kubernetes version of permissions to allow Prometheus to see everything

Setup a service account, clusterRole and clusterRoleBinding. Create the following files
**service-account.yaml**
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: prometheus
```
**clusterRole.yaml**
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
- apiGroups: [""]
  resources:
  - nodes
  - nodes/metrics
  - services
  - endpoints
  - pods
  verbs: ["get", "list", "watch"]
- apiGroups: [""]
  resources:
  - configmaps
  verbs: ["get"]
- apiGroups:
  - networking.k8s.io
  resources:
  - ingresses
  verbs: ["get", "list", "watch"]
- nonResourceURLs: ["/metrics"]
  verbs: ["get"]
```
**clusterRoleBinding.yaml**
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: prometheus
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: prometheus
subjects:
- kind: ServiceAccount
  name: prometheus
  namespace: default
```
Apply the files to the default namespace
```bash
oc apply -f service-account.yaml 
oc apply -f clusterRole.yaml 
oc apply -f clusterRoleBinding.yaml 
```
You should be able to access the route the default namespace
```bash
oc get routes 
``` 	
You can open the Prometheus UI by adding a http:// to the Prometheus HOST/PORT returned from the oc get routes command
![prometheus UI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yquddzw2fh85ivwn0uj3.png)

## So how do you know if its working
It takes a little while for the Prometheus operator to reconcile and to show up the new resources. In the Prometheus ui first check the `Status\Service Discovery` you should see example-app show up
![screenshot status\service discovery](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s1l94sqtx5xe18wcnrwt.png)
>**NOTE:** be patient it can take a while to show up

Then check the `Status\Targets` should see the following targets up

![screenshot status\targets up](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y0oskurti0tk67r7zrqo.png)

You also should be able to see metrics from example-app in the graph tab
![screenshot of the graph tab showing example-apps metrics](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pa6yziyxuy853xhk2hzo.png)

That it I may do a follow up on setting up Grafana to use these metrics










