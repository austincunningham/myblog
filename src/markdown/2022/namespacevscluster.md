# Changing an Existing Kubernetes operator to cluster scoped 

![banner image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3b6ugw1ncsjj85sfsm3m.png)

Operator scope is what namespaces you operator will watch for Custom Resources(CR's) to be acted upon. 
- Namespaced scoped (watch a single namespace)
- Cluster scoped (watch all namespaces) 

The operator-sdk documentation talks about setting the watchNamespace to an empty string in the operator-sdk `main.go` may look something like the following.  
```golang
    // check the WATCH_NAMESPACE env var to see if populated
    var watchNamespaceEnvVar = "WATCH_NAMESPACE"

    ns, found := os.LookupEnv(watchNamespaceEnvVar)
    if !found {
        return "", fmt.Errorf("%s must be set", watchNamespaceEnvVar)
    }
mgr, err := ctrl.NewManager(ctrl.GetConfigOrDie(), ctrl.Options{
    Scheme:             scheme,
    MetricsBindAddress: metricsAddr,
    Port:               9443,
    LeaderElection:     enableLeaderElection,
    LeaderElectionID:   "f1c5ece8.example.com",
    Namespace:          watchNamespace, // namespaced-scope when the value is not an empty string
})
```
If `Namespace` is not set or set to an empty string your operator will already be cluster scoped. 

If like me you are using OLM ([Operator Lifecycle Mananger](https://olm.operatorframework.io)) to handle install and upgrades of your operator,you don't need change the code in main.go, OLM now handles all scoping changes for you. You only need to change the CSV and the operator group on cluster.

> **NOTE:** v1.0.0 the Operator-sdk or greater 

First you set the install `installModes` for `AllNamespaces` to `true` in your CSV(ClusterServiceVersion)
```yaml
 installModes:
  - supported: true
    type: OwnNamespace
  - supported: true
    type: SingleNamespace
  - supported: false
    type: MultiNamespace
  - supported: true
    type: AllNamespaces 
```
Once this is set and deployed with OLM on cluster the only change we need is to the OperatorGroup spec. A namespaced operatorGroup spec will look like 
```yaml
spec:
  targetNamespaces:
  - whatever_WATCH_NAMESPACES_is
```
To set to Cluster scoped change the spec
```yaml
spec: {}
```
As `AllNamespaces` is set in CSV you don't have to do anything else the operator will change to cluster scoped and watch all namespaces. If you don't update the operatorGroup the operator will remain namespaces scoped. So we go from namespaces scoped

![Example NameSpaced Scoped](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uxhjs27f6xvmhgly3yk7.png)

To cluster scoped

![Example Cluster-scoped](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/le2m9dls0d2gz2g1goz1.png)

Things to note the resources footprint is a little higher for the cluster scoped operator and CSV for the Operator are created in all namespaces on the cluster. 







