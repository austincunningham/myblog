



![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gkabc2erkfgaceeax6qn.png)


# Install the Keycloak via the operator
Create a project
```bash
oc new-project keycloak
```
I am going to install the operator the OperatorHub in Openshift which uses OLM(Operator Lifecyecle Manager). Select Operator/OperatorHub from the side bar and search for keycloak and install it in the keycloak namespace

![Install the keycloak operator via operatorhub](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0sqtsuywlr70jun04wru.gif)

The install should finish
![Keycloak operator install is finished](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/t5h8uiovwb07yhpo0u00.png)

I will go through the requirements now. This will not be a production setup. 

## Install an DB
Going to install an Ephemeral PostgreSQL DB as this is just a demo, create a yaml file called `example-postgres.yaml` with the following content.
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgresql-db
spec:
  serviceName: postgresql-db-service
  selector:
    matchLabels:
      app: postgresql-db
  replicas: 1
  template:
    metadata:
      labels:
        app: postgresql-db
    spec:
      containers:
        - name: postgresql-db
          image: postgres:latest
          env:
            - name: POSTGRES_PASSWORD
              value: postgres #<-- change this
            - name: POSTGRES_USER
              value: postgres #<-- change this
            - name: PGDATA
              value: /data/pgdata
            - name: POSTGRES_DB
              value: keycloak
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-db
spec:
  selector:
    app: postgresql-db
  ports:
  - port: 5432
    targetPort: 5432
```
And then apply the file to the cluster
```
oc apply -f example-postgres.yaml
``` 
The result 
```
statefulset.apps/postgresql-db created
service/postgres-db created
```
After checking the postgres pod logs I see the following error
```bash
mkdir: cannot create directory ‘/data’: Permission denied
```
Nothing is ever easy. This is because Openshift blocks containers being run as root. To get this to work we need to add a service account with the correct permissions and add that service account to the statefulset. This is a good reference [blog](https://suedbroecker.net/2021/12/14/open-the-door-for-root-users-in-red-hat-openshift-example-statefulset%C2%B6/) for more details. Here are the commands I used
```bash
# create the service account
~ oc create sa postgres-sa
serviceaccount/postgres-sa created
# add policy
~ oc adm policy add-scc-to-user anyuid -z postgres-sa
clusterrole.rbac.authorization.k8s.io/system:openshift:scc:anyuid added: "postgres-sa"
# set the policy on the namespace
~ oc adm policy add-scc-to-user anyuid -z postgres-sa -n keycloak
clusterrole.rbac.authorization.k8s.io/system:openshift:scc:anyuid added: "postgres-sa"
# add the service account to the statefulset
~ oc set sa statefulset postgresql-db postgres-sa
statefulset.apps/postgresql-db serviceaccount updated
# delete the failing existing pod
oc delete po postgresql-db-0
# check the pods 
~ oc get po
NAME                                 READY   STATUS    RESTARTS   AGE
keycloak-operator-5659f58f4b-vtrm9   1/1     Running   0          29m
postgresql-db-0                      1/1     Running   0          8m55s
```
Ok that's working


## Hostname

We need a resolvable domain name. You can add any domain to your openshift cluster using a [customDomain](https://docs.openshift.com/rosa/applications/deployments/osd-config-custom-domains-applications.html). As I couldn't be bothered setting up an actual domain name here or a valid cert is a quick hack for creating a resolvable domain name on Openshift.

```bash
# create a self signed cert 
openssl req -subj '/CN=apps.austin.me/O=Test Keycloak./C=US' -newkey rsa:2048 -nodes -keyout key.pem -x509 -days 365 -out certificate.pem
# create cert project
oc new-project certs
# create a secret from that cert in the cert namespace
oc create secret tls austin-me-tls --cert=austin.me.crt --key=austin.me.key -n certs
# create a custom domain based on the cert
oc apply -f - <<EOF                                                      
---
apiVersion: managed.openshift.io/v1alpha1
kind: CustomDomain
metadata:
  name: cunningham
spec:
  domain: apps.austin.me
  scope: External
  certificate:
    name: austin-me-tls
    namespace: certs
EOF
# Wait for the custom domain to become ready 
oc get customdomains                                              
NAME         ENDPOINT                                          DOMAIN           STATUS
cunningham   oeffrs.cunningham.aucunnin.lpi0.s1.devshift.org   apps.austin.me   Ready
```
All pretty standard at this point but the domain apps.austin.me doesn't exist. So here is the hack edit the custom domain `oc edit customdomain cunningham` and replace the spec.host with the endpoint. 
```yaml
apiVersion: managed.openshift.io/v1alpha1
kind: CustomDomain
metadata: 
  name: cunningham
spec:
  certificate:
    name: austin-me-tls
    namespace: certs
  domain: oeffrs.cunningham.aucunnin.lpi0.s1.devshift.org #<---- was apps.austin.me now points at the endpoint
  loadBalancerType: Classic
  scope: External
```

So our domain going forward is the endpoint `oeffrs.cunningham.aucunnin.lpi0.s1.devshift.org`


## Create a DB secret
```bash
oc project keycloak
# change these to match the secret used in your statefulset
kubectl create secret generic keycloak-db-secret \
  --from-literal=username=postgres \
  --from-literal=password=postgres
```
## Create the Keycloak CR 
The CR(Custom Resource) creates a instance of the Keycloak UI. Create a yaml file called `example-kc.yaml`

```yaml
apiVersion: k8s.keycloak.org/v2alpha1
kind: Keycloak
metadata:
  name: example-kc
spec:
  instances: 1
  db:
    vendor: postgres
    host: postgres-db
    usernameSecret:
      name: keycloak-db-secret
      key: username
    passwordSecret:
      name: keycloak-db-secret
      key: password
  http:
    tlsSecret: austin-me-tls
  hostname:
    hostname: oeffrs.cunningham.aucunnin.lpi0.s1.devshift.org
```
And then apply the file
```bash
kubectl apply -f example-kc.yaml
```
We can check the CR status of keycloak, it will look like this when it is `type: Ready` `status: "True"`
```bash
# using https://mikefarah.gitbook.io/yq/
~ oc get keycloak example-kc -oyaml | yq '.status'
conditions:
  - lastTransitionTime: "2023-09-15T08:08:56.665783288Z"
    message: ""
    observedGeneration: 1
    status: "True"      #<------ This is what we are looking for I hate these condition to difficult to read a first glance
    type: Ready
  - lastTransitionTime: "2023-09-15T08:08:26.147242224Z"
    message: ""
    observedGeneration: 1
    status: "False"
    type: HasErrors
  - lastTransitionTime: "2023-09-15T08:08:26.147242224Z"
    message: ""
    observedGeneration: 1
    status: "False"
    type: RollingUpdate
instances: 1
observedGeneration: 1
selector: app=keycloak,app.kubernetes.io/managed-by=keycloak-operator,app.kubernetes.io/instance=example-kc

```
That looks to have completed and if we port-forward the service it looks to be working
```bash
~ oc port-forward service/example-kc-service 8443:8443
Forwarding from 127.0.0.1:8443 -> 8443
Forwarding from [::1]:8443 -> 8443
Handling connection for 8443
Handling connection for 8443
Handling connection for 8443
Handling connection for 8443
Handling connection for 8443
``` 
![Keycloak landing page after port forward](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ve5ibgtju5lygkqig1dg.png)

And if we check the route we can open the keycloak landing page.
```bash
oc get routes --namespace keycloak
NAME                       HOST/PORT                                                    PATH   SERVICES             PORT    TERMINATION            WILDCARD
example-kc-ingress-76p8j   oeffrs.cunningham.aucunnin.lpi0.s1.devshift.org ... 1 more          example-kc-service   https   passthrough/Redirect   None
```
![Keycloak landing page using route](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fdtz3dm9ydp14nshyy0r.png)







