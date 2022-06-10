# Build a Kubernetes Operator

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dg59bnxb16y3cv709e4w.jpg)

## Prerequisites :
Kubernetes cluster (as I am going to be adding some Openshift native resources I will be using CRC which is a local dev kubernetes cluster you can install on your pc)

Cluster admin access to that cluster

## Using the Opereator-sdk to bootstrap your project
First what is an Kubernetes operator? Operators allow you to extend the Kubernetes API by adding you own custom resources to a cluster. This is the most basic operator I can make, It will create a pod for a micro service and create a route for the micro service and allow you to specify the amount of replicas. I will outline all the steps I have take. First I use the generate command to scaffold the operator project. 
```bash
mkdir pod-route
cd pod-route
# --domain example.com is used in the operator-sdk quickstart guide this is used to create the api group, think of package in java. 
# This was my first gotcha following my misreading of the docs. You need to be careful when choosing domain name as is difficult to revert after its generated.I will continue with quay.io for now.  
# --repo is your git repo where you operator code will live 
operator-sdk init --domain quay.io --repo github.com/austincunningham/pod-route
# Add a controller
# --version I use v1alpha1 (this is a Kubernetes API version for early candidates)
# --kind name of Custom Resource
operator-sdk create api --version v1alpha1 --kind Podroute --resource --controller
# build and push the operator image make docker-build docker-push IMG="quay.io/austincunningham/pod-route:v0.0.1"
```
Your files should look like [this](https://github.com/austincunningham/pod-route/pull/2) and the container [repo](https://quay.io/repository/austincunningham/pod-route) is pushed
Next I edit my `api/v1alpha1/podroute_types.go` file spec `PodrouteSpec`. The spec is basically what I want to be managed by the operator.  
```go
// PodrouteSpec defines the desired state of Podroute
type PodrouteSpec struct {
	// Image container image string e.g. "quay.io/austincunningham/always200:latest"
	// Replicas number of containers to spin up
	Image string `json:"image,omitempty"`
	Replicas int32 `json:"replicas,omitempty"`
} 
```
After changing the types file we need to update the files in the operator run the following commands
```bash
make generate
make manifests
```
## Add your controller logic
Now I can start looking at my reconcile logic in `controllers/podroute_controller.go` we add some RBAC rules for pods and deployments and do a client get on the cluster to find the Custom Resource(CR). The rest of this is generated code. 
```go
package controllers

import (
	"context"

	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/log"

	quayiov1alpha1 "github.com/austincunningham/pod-route/api/v1alpha1"
)

// PodrouteReconciler reconciles a Podroute object
type PodrouteReconciler struct {
	client.Client
	Scheme *runtime.Scheme
}

//+kubebuilder:rbac:groups=quay.io,resources=podroutes,verbs=get;list;watch;create;update;patch;delete
//+kubebuilder:rbac:groups=quay.io,resources=podroutes/status,verbs=get;update;patch
//+kubebuilder:rbac:groups=quay.io,resources=podroutes/finalizers,verbs=update
//+kubebuilder:rbac:groups=apps,resources=deployments,verbs=get;list;watch;create;update;patch;delete
//+kubebuilder:rbac:groups=core,resources=pods,verbs=get;list;

func (r *PodrouteReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	_ = log.FromContext(ctx)

	// your logic here
	// Create a Custom Resource object for Podroute, quayio part of the name is due to my earlier mistake
	cr := &quayiov1alpha1.Podroute{}
	// do a kubernetes client get to check if the CR is on the Cluster
	err := r.Client.Get(ctx, req.NamespacedName, cr)
	if err != nil {
		return ctrl.Result{}, err
	}

	return ctrl.Result{}, nil
}

// SetupWithManager sets up the controller with the Manager.
func (r *PodrouteReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&quayiov1alpha1.Podroute{}).
		Complete(r)
}
```
So the first thing I need to do is check for a existing deployment and if it doesn't exist create it.
In the `Reconcile` function before the last `return ctrl.Result{}, nil` add a call to createDeployment function like so
```go
	deployment, err := r.createDeployment(cr, r.podRouteDeployment(cr))
	if err != nil {
		return reconcile.Result{}, err
	}
	// just logging here to keep Go happy will use later
	log.Log.Info("deployment", deployment)
```
I create a labels function as will be using this for all resources
```go
func labels(cr *quayiov1alpha1.Podroute, tier string) map[string]string {
	// Fetches and sets labels

	return map[string]string{
		"app":         "PodRoute",
		"podroute_cr": cr.Name,
		"tier":        tier,
	}
}
```
I create a deployment object 
```go
// This is the equivalent of creating a deployment yaml and returning it
// It doesn't create anything on cluster
func (r *PodrouteReconciler) podRouteDeployment(cr *quayiov1alpha1.Podroute) *appsv1.Deployment {
	// Build a Deployment
	labels := labels(cr, "backend-podroute")
	size := cr.Spec.Replicas
	podRouteDeployment := &appsv1.Deployment{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "pod-route",
			Namespace: cr.Namespace,
		},
		Spec: appsv1.DeploymentSpec{
			Replicas: &size,
			Selector: &metav1.LabelSelector{
				MatchLabels: labels,
			},
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: labels,
				},
				Spec: corev1.PodSpec{
					Containers: []corev1.Container{{
						Image:           cr.Spec.Image,
						ImagePullPolicy: corev1.PullAlways,
						Name:            "podroute-pod",
						Ports: []corev1.ContainerPort{{
							ContainerPort: 8080,
							Name:          "podroute",
						}},
					}},
				},
			},
		},
	}

	// sets the this controller as owner
	controllerutil.SetControllerReference(cr, podRouteDeployment, r.Scheme)
	return podRouteDeployment
}
```
I check the cluster using Client.Get for an existing deployment if not then create one using the deployment object created above.
```go
// check for a deployment if it doesn't exist it creates one on cluster using the deployment created in deployment
func (r PodrouteReconciler) createDeployment(cr *quayiov1alpha1.Podroute, deployment *appsv1.Deployment) (*appsv1.Deployment, error) {
	// check for a deployment in the namespace
	found := &appsv1.Deployment{}
	err := r.Client.Get(context.TODO(), types.NamespacedName{Name: deployment.Name, Namespace: cr.Namespace}, found)
	if err != nil {
		log.Log.Info("Creating Deployment")
		err = r.Client.Create(context.TODO(), deployment)
		if err != nil {
			log.Log.Error(err, "Failed to create deployment")
			return found, err
		}
	}
	return found, nil
}
```
Next I check if the deployment replicas match the number in the CR(Custom Resource) in the Reconcile function remove the comment `log.Log.Info("deployment", deployment)` and replace it with

```go
	// If the spec.Replicas in the CR changes, update the deployment number of replicas
	if deployment.Spec.Replicas != &cr.Spec.Replicas {
		controllerutil.CreateOrUpdate(context.TODO(), r.Client, deployment, func() error {
			deployment.Spec.Replicas = &cr.Spec.Replicas
			return nil
		})
	}
``` 
So what have we done so far we have a CR that takes in a image(container) and number of replicas and creates a deployment for it. Next we will create the Service and the route , These will have a similar pattern to the deployment i.e. create an route/service object and check if it exists if not create. We will start with the service. In the reconcile function before the last return add a createService function call `return ctrl.Result{}, nil`
```go
	err = r.createService(cr, r.podRouteService(cr))
	if err != nil {
		return reconcile.Result{}, err
	}
```
Use this function to create the service object
```go
// This is the equivalent of creating a service yaml and returning it
// It doesnt create anything on cluster
func (r PodrouteReconciler) podRouteService(cr *quayiov1alpha1.Podroute) *corev1.Service {
	labels := labels(cr, "backend-podroute")

	podRouteService := &corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "podroute-service",
			Namespace: cr.Namespace,
		},
		Spec: corev1.ServiceSpec{
			Selector: labels,
			Ports: []corev1.ServicePort{{
				Protocol:   corev1.ProtocolTCP,
				Port:       8080,
				TargetPort: intstr.FromInt(8080),
			}},
		},
	}

	controllerutil.SetControllerReference(cr, podRouteService, r.Scheme)
	return podRouteService
}
```
Add a function to create the service from the service object above
```go
// check for a service if it doesn't exist it creates one on cluster using the service created in podRouteService
func (r PodrouteReconciler) createService(cr *quayiov1alpha1.Podroute, podRouteServcie *corev1.Service) error {
	// check for a deployment in the namespace
	found := &corev1.Service{}
	err := r.Client.Get(context.TODO(), types.NamespacedName{Name: podRouteServcie.Name, Namespace: cr.Namespace}, found)
	if err != nil {
		log.Log.Info("Creating Service")
		err = r.Client.Create(context.TODO(), podRouteServcie)
		if err != nil {
			log.Log.Error(err, "Failed to create Service")
			return err
		}
	}
	return nil
}
```
And finally the Route add createRoute function call in the Reconcile before the last `return ctrl.Result{}, nil`
```go
	err = r.createRoute(cr, r.podRouteRoute(cr))
	if err != nil{
		return reconcile.Result{}, err
	}
```
Create a function for the route object
```go
// This is the equivalent of creating a route yaml file and returning it
// It doesn't create anything on cluster
func (r PodrouteReconciler) podRouteRoute(cr *quayiov1alpha1.Podroute) *routev1.Route {
	labels := labels(cr, "backend-podroute")

	podRouteRoute := &routev1.Route{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "podroute-route",
			Namespace: cr.Namespace,
			Labels:    labels,
		},
		Spec: routev1.RouteSpec{
			To: routev1.RouteTargetReference{
				Kind: "Service",
				Name: "podroute-service",
			},
			Port: &routev1.RoutePort{
				TargetPort: intstr.FromInt(8080),
			},
		},
	}
	controllerutil.SetControllerReference(cr, podRouteRoute, r.Scheme)
	return podRouteRoute
}
```
Add a function to create the route from the route object above
```go
// check for a route if it doesn't exist it creates one on cluster using the route created in podRouteRoute
func (r PodrouteReconciler) createRoute(cr *quayiov1alpha1.Podroute, podRouteRoute *routev1.Route) error {
	// check for a deployment in the namespace
	found := &routev1.Route{}
	err := r.Client.Get(context.TODO(), types.NamespacedName{Name: podRouteRoute.Name, Namespace: cr.Namespace}, found)
	if err != nil {
		log.Log.Info("Creating Route")
		err = r.Client.Create(context.TODO(), podRouteRoute)
		if err != nil {
			log.Log.Error(err, "Failed to create Route")
			return err
		}
	}
	return nil
}
```
> **NOTE:** imports did change with these code changes
```go
import (
	"context"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/intstr"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
	"sigs.k8s.io/controller-runtime/pkg/reconcile"

	routev1 "github.com/openshift/api/route/v1"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/log"

	quayiov1alpha1 "github.com/austincunningham/pod-route/api/v1alpha1"
)
```
Also because route is an openshift thing and not kubernetes native I had to add it to the scheme in the main.go file
```go
	if err := routev1.AddToScheme(mgr.GetScheme()); err != nil {
		setupLog.Error(err, "failed to add routev1 to scheme")
		os.Exit(1)
	}
```
## Testing your Operator
Start up CRC ([code ready containers] (https://developers.redhat.com/products/openshift-local/overview)) with `crc start`
```bash
crc start
INFO Adding crc-admin and crc-developer contexts to kubeconfig... 
Started the OpenShift cluster.

The server is accessible via web console at:
  https://console-openshift-console.apps-crc.testing

Log in as administrator:
  Username: kubeadmin
  Password: KUBEADMIN_PASSWORD

Log in as user:
  Username: developer
  Password: developer

Use the 'oc' command line interface:
  $ eval $(crc oc-env)
  $ oc login -u developer https://api.crc.testing:6443
```
Login to the CRC cluster as kubeadmin
```bash
oc login -u kubeadmin -p KUBEADMIN_PASSWORD https://api.crc.testing:6443
```
Create a project, the Makefile has a a lot of commands generated by the opeator-sdk which we can use
```bash 
oc new-project podroute
# Installs the custom resource definitions onto the cluster
make install
# Create the CR on cluster
oc apply -f - <<EOF
---
apiVersion: quay.io/v1alpha1
kind: Podroute
metadata:
  name: test-podroute
  namespace: podroute
spec:
  image: quay.io/austincunningham/always200:latest
  replicas: 3
EOF
# We can then run the operator locally
make run
# Should see something like
2022-06-10T14:41:28.854+0100	INFO	Creating Deployment
2022-06-10T14:41:28.980+0100	INFO	Creating Service
2022-06-10T14:41:29.114+0100	INFO	Creating Route
```
You can confirm everything is up
```bash
# get the servic
oc get service
NAME               TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
podroute-service   ClusterIP   10.217.5.14   <none>        8080/TCP   4m38s
# get the route
oc get route
NAME             HOST/PORT                                  PATH   SERVICES           PORT   TERMINATION   WILDCARD
podroute-route   podroute-route-podroute.apps-crc.testing          podroute-service   8080                 None
# should be 3 pod replicas 
oc get pods
NAME                        READY   STATUS    RESTARTS   AGE
pod-route-96b87c455-6sw2h   1/1     Running   0          4m12s
pod-route-96b87c455-ghdm8   1/1     Running   0          4m12s
pod-route-96b87c455-md426   1/1     Running   0          4m12s
# the get route should be alive and return ok
curl http://podroute-route-podroute.apps-crc.testing/get
OK%  
```
Reference:

[Operator-sdk quickstart guide](https://sdk.operatorframework.io/docs/building-operators/golang/quickstart/)

[Operator-sdk Golang tutorial](https://sdk.operatorframework.io/docs/building-operators/golang/tutorial/)

[Git repo](https://github.com/austincunningham/pod-route)

>**NOTE:** build with operator-sdk v1.15.0