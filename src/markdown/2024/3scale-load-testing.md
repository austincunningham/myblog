![banner image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9bdxkol83c9k6u4jhk2t.png)

I was interested in doing some load testing against 3scale. After a bit of digging around I found that there was an open source load testing toolkit in https://github.com/3scale-labs/perftest-toolkit.

![Load testing overview](https://github.com/3scale-labs/perftest-toolkit/blob/main/deployment/doc/infrastructure.png?raw=true)

At first look I was unsure what this gave me or what it required. So after playing around with it a while I eventually figured it out along with a few pain points.

## What do we need
Prerequisites:
- An Openshift Kubernetes cluster
- An instance of 3scale on this cluster
- An ec2 instance that can connect a route on your cluster. It also can connect to your local pc via ssh. As your load testing this ec2 instance needs to be resourced to handle the load e.g.`c5.xlarge`. 
- Ansible 2.9.14 (this is used by the repo to deploy resources) 
- an endpoint like the echo-api endpoint, the following commands below to deploy an echo-api in an echo-api namespace
```bash
oc new-project echo-api
cat << EOF | oc create -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: echo-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: echo-api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
  template:
    metadata:
      labels:
        app: echo-api
    spec:
      containers:
        - name: echo-api
          image: quay.io/3scale/echoapi:stable
          livenessProbe:
            tcpSocket:
              port: 9292
            initialDelaySeconds: 10
            timeoutSeconds: 1
          readinessProbe:
            httpGet:
              path: /test/200
              port: 9292
            initialDelaySeconds: 15
            timeoutSeconds: 1
          ports:
            - containerPort: 9292
              protocol: TCP
---
apiVersion: v1
kind: Service
metadata:
  name: echo-api
spec:
  ports:
  - name: echo-api-port
    port: 9292
    protocol: TCP
    targetPort: 9292
  selector:
    app: echo-api
  type: ClusterIP
---
kind: Route
apiVersion: route.openshift.io/v1
metadata:
  name: echo-api
  namespace: echo-api
spec:
  to:
    kind: Service
    name: echo-api
  port:
    targetPort: echo-api-port
  tls:
    termination: edge
    insecureEdgeTerminationPolicy: Allow
  wildcardPolicy: None
---
EOF
```


## What does it give us? 
Well the perftest-toolkit creates 3scale resources like backends and products.
![3scale UI with load testing products and backends](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/r4gojnww5tsmuzik3ack.png)
It installs Hyperfoil(cli load testing tool)locally and on the remote ec2 instance. This can be accessed via the browser on the ec2 instance public address via port 8090 or directly on the ec2 instances
![hyperfoil cli in browser](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/647hbuh2r1xv5l5gy9ck.png)

It uploads a benchmark yaml file like the following
```yaml
name: 3scale-benchmark
agents:
  ec2-agent: 
    host: ec2-54-93-91-242.eu-central-1.compute.amazonaws.com
    port: 22
http:
- host: https://perf-test-dwxpoent-3scale-apicast-production.apps.aucunnin-ccs.lpi0.s1.devshift.org:443
  sharedConnections: 50
usersPerSec: 228
duration: 3600s
maxDuration: 3600s
scenario:
- testSequence:
  - randomCsvRow:
     file: /tmp/3scale.csv
     skipComments: 'True'
     removeQuotes: 'True'
     columns:
       0: target-host
       1: uri
  - template:
      pattern: ${target-host}:443
      toVar: target-authority
  - httpRequest:
      authority:
        fromVar: target-authority
      GET:
        fromVar: uri
      headers:
        HOST:
          fromVar: target-host

threads: 4
```
It also uploads a csv with endpoint data to the /tmp directory on the ec2 instance which is consumed by the benchmark above. 
```bash
cat 3scale.csv 
"perf-test-dwxpoent-3scale-apicast-production.apps.aucunnin-ccs.lpi0.s1.devshift.org","/pets?user_key=<some_user_key_from_3scale>"
```
It will run the test automatically and returns a html report when done e.g. 0001.html

![hyperfoil report in browser](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z2vwrnfchxx61w5p95kw.gif)

## Pain Points
Firstly a couple of pain points. I needed to install docker on the ec2 instance as it was a Redhat RHEL 8 AIM I used the following commands on the ec2 instance
```bash
sudo yum-config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo &&
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin &&
sudo systemctl start docker &&
sudo usermod -aG docker $USER &&
newgrp docker
```
The version of Hyperfoil I was using requires `id_rsa` key pair on the ec2 instance, so I generated them and added the public key to the authorized_keys
```bash
cd ~/.ssh/
ssh-keygen -t rsa
cat id_rsa.pub >> authorized_keys
```
There are few Ansible playbooks to run as part of the perftest-toolkit but I hit a few blockers when trying to run them. In the end I ended up using ansible-galaxy to install the missing collections

```bash
# You may not have to do this ansible-galaxy collection list will show you if the are installed or not
ansible-galaxy collection install ansible.posix
ansible-galaxy collection install community.docker
ansible-galaxy collection install community.general
```

In `deployment/ansible.cfg` I needed to point the the ssh key to be allow Ansible to access the ec2 instance via ssh so added the [ssh_connection] section. Updating this was in the readme but was missing the key
```toml
# project specific configuration for Ansible 

[defaults]
inventory_plugins=inventory
command_warnings=False

[inventory]
enable_plugins=3scale_inventory_plugin,ini

[ssh_connection]
ssh_args = -o ServerAliveInterval=30 -i "~/.ssh/pem_key_name.pem"
pipelining = True
```
In `deployment/roles/platform-setup/vars/RedHat.yml` need to set the java version
```yaml
---
java_package:
  - java-11-openjdk
unzip_package:
  - unzip
```
One final pain point found that running Hyperfoil for longer runs 4 to 6 hours ended hitting up against some Garbage collection issue
```json
Error [
"ec2-agent: Jitter watchdog was not invoked for 109 ms; check GC settings.",
"ec2-agent: Agent unexpectedly left the cluster."
]
```
Got around this by increasing the java memory settings with `extras: -XX:+UseShenandoahGC -Xms1G -Xmx4G` in the Hyperfoil benchmark to the max my ec2 instance could handle in this case 4GB. I updated `deployment/benchmark/3scale-benchemark.yaml.j2` as follows 

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/crwu63rpepi8liosg363.png)


## Getting started

Run the requirements playbook to install Hyperfoil locally
```bash
git clone https://github.com/3scale-labs/perftest-toolkit
cd deployment
ansible-galaxy install -r requirements.yaml
```
Next we edit a couple of files. First `deployment/hosts` we add in the ec2 instances public address

```toml
upstream ansible_host=ec2-54-93-91-242.eu-central-1.compute.amazonaws.com ansible_user=ec2-user

[hyperfoil_controller]
ec2 ansible_host=ec2-54-93-91-242.eu-central-1.compute.amazonaws.com ansible_user=ec2-user

[hyperfoil_agent]
ec2-agent ansible_host=ec2-54-93-91-242.eu-central-1.compute.amazonaws.com ansible_user=ec2-user
```
In the `deployment/run.yml` we set 
- **shared_connections** (Hyperfoil setting number of concurrent connections to your load testing endpoint. A pain point if set to low Hyperfoil will fail the load test and if set to high can overload the test, you have to play around with it. Found for a 5 million request per day shared_connection of 30 worked where as 100 we see an increase in the 4xx error rate)
- **users_per_sec** (rate per second  e.g. 5 million request per day 5000,000÷60÷60÷24 = 57.87 so round to 58 rps)
- **duration_sec** (length of load test run in seconds)
```yaml
---
- hosts: hyperfoil_controller
  roles:
    - hyperfoil.hyperfoil_test
  vars:
    test_name: 3scale-benchmark
    test_files:
      - "{{ csv_dest_file_path }}"
    shared_connections: 50
    users_per_sec: 58
    duration_sec: 3600
- hosts: hyperfoil_controller
  become: yes
  roles:
    - hyperfoil_generate_report
- hosts: hyperfoil_controller
  tasks:
    - name: Retrieve the report
      fetch:
        src: "{{ reports_path }}/{{ test_runid }}.html"
        dest: "{{ playbook_dir }}/{{ toolkit_csv_file_path }}/"
        flat: yes
```
Next we need to populate the `main.yml` found in `deployments/roles/profiled-traffic-generator/defaults/main.yml`
You need to get the 3scale-admin route, 3scale admin access token and the echo-api route
```bash
oc get routes -n <3scale-namespace-here> | grep 3scale-admin | awk '{print $2}'
3scale-admin.apps.aucunnin-ccs.lpi0.s1.devshift.org                                          
oc get secret system-seed -n <3scale-namespace-here> -o jsonpath="{.data.ADMIN_ACCESS_TOKEN}"| base64 --decode
<Some_token>
oc get routes -n echo-api | awk '{print $2}'
echo-api-echo-api.apps.aucunnin-ccs.lpi0.s1.devshift.org          
```
And add them to `main.yml` as follows
```yaml
---
# defaults file for profiled-traffic-generator

# URI that includes your password and portal endpoint in the following format: <schema>://<password>@<admin-portal-domain>.
# The <password> can be either the provider key or an access token for the 3scale Account Management API.
# <admin-portal-domain> is the URL used to log into the admin portal.
# Example: https://access-token@account-admin.3scale.net
threescale_portal_endpoint: https://<Some-token>@3scale-admin.apps.aucunnin-ccs.lpi0.s1.devshift.org/

# Used traffic for performance testing is not real traffic.
# It is synthetically generated traffic based on traffic models.
# Information about available traffic profiles (or test plans) can be found here:
# https://github.com/3scale/perftest-toolkit/blob/master/buddhi/README.md#profiles
# Currently available profiles: [ simple | backend | medium | standard ]
traffic_profile: simple

# Private Base URL
# Make sure your private application behaves like an echo api service
# example: https://echo-api.3scale.net:443
private_base_url: https://echo-api-echo-api.apps.aucunnin-ccs.lpi0.s1.devshift.org

# Public Base URL
# Public address of your API gateway in the production environment.
# Optional. When it is left empty, public base url will be the hosted gateway url
# example: https://gw.example.com:443
public_base_url: 
```
**Note** we have selected the simple profile here as it's quickest to setup and is a single product and backend.Other profiles are `backend, medium, standard` with standard producing the most endpoints and being a slower setup. 


So once we have the hosts, run and main set we can run the following playbook which is basically setup and deployment jobs

```bash
ansible-playbook -i hosts profiled-injector.yml
```
Once completed you can run your test with this playbook

```bash
ansible-playbook -i hosts -i benchmarks/3scale.csv run.yml
``` 
## So how do you know it's working? 
You will see a polling in the Ansible output 

![ansible polling output](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w3v1ov729gjfiw2zhrrp.png)

The Ansible output above is showing that this is `run/0001` we can hit that endpoint using the ec2 public address and port 8090 and can check the status, below is an example of a  complete status

![Check run via hyperfoil run endpoint](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h8us0bazi0vsnkqbl6x6.png)

You can ssh to the ec2 instance and access via the Hyperfoil cli in `/tmp/hyperfoil/hyperfoile-0.15/bin` and run the cli with `./cli.sh`

![Check run via hyperfoil CLI](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g802bjayl8vcm0h26afz.png)

As stated above you should get a run html file each time you run the load test in the `deployments/benchmarks` directory which can be opened in the browser.

![0000.html run file](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zrpoz83bjve7leu52tx3.png)

We can then gather things from the report like percentile response times, number of successful/failed request etc.

![report screenshot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/alwaur50t2bh8vxhr59o.png)














