(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d213196"],{aadd:function(s,t,a){"use strict";a.r(t);var e=function(){var s=this,t=s.$createElement;s._self._c;return s._m(0)},n=[function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("section",[a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9bdxkol83c9k6u4jhk2t.png",alt:"banner image"}})]),a("p",[s._v("I was interested in doing some load testing against 3scale. After a bit of digging around I found that there was an open source load testing toolkit in https://github.com/3scale-labs/perftest-toolkit.")]),a("p",[a("img",{attrs:{src:"https://github.com/3scale-labs/perftest-toolkit/blob/main/deployment/doc/infrastructure.png?raw=true",alt:"Load testing overview"}})]),a("p",[s._v("At first look I was unsure what this gave me or what it required. So after playing around with it a while I eventually figured it out along with a few pain points.")]),a("h2",[s._v("What do we need")]),a("p",[s._v("Prerequisites:")]),a("ul",[a("li",[s._v("An Openshift Kubernetes cluster")]),a("li",[s._v("An instance of 3scale on this cluster")]),a("li",[s._v("An ec2 instance that can connect a route on your cluster. It also can connect to your local pc via ssh. As your load testing this ec2 instance needs to be resourced to handle the load e.g."),a("code",{pre:!0},[s._v("c5.xlarge")]),s._v(".")]),a("li",[s._v("Ansible 2.9.14 (this is used by the repo to deploy resources)")]),a("li",[s._v("an endpoint like the echo-api endpoint, the following commands below to deploy an echo-api in an echo-api namespace")])]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("oc new-project "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api\ncat << EOF | oc create -f -\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api\n  strategy:\n    "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("type")]),s._v(": RollingUpdate\n    rollingUpdate:\n      maxSurge: 25%\n      maxUnavailable: 25%\n  template:\n    metadata:\n      labels:\n        app: "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api\n    spec:\n      containers:\n        - name: "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api\n          image: quay.io/3scale/echoapi:stable\n          livenessProbe:\n            tcpSocket:\n              port: 9292\n            initialDelaySeconds: 10\n            timeoutSeconds: 1\n          readinessProbe:\n            httpGet:\n              path: /"),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("test")]),s._v("/200\n              port: 9292\n            initialDelaySeconds: 15\n            timeoutSeconds: 1\n          ports:\n            - containerPort: 9292\n              protocol: TCP\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api\nspec:\n  ports:\n  - name: "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api-port\n    port: 9292\n    protocol: TCP\n    targetPort: 9292\n  selector:\n    app: "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api\n  "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("type")]),s._v(": ClusterIP\n---\nkind: Route\napiVersion: route.openshift.io/v1\nmetadata:\n  name: "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api\n  namespace: "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api\nspec:\n  to:\n    kind: Service\n    name: "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api\n  port:\n    targetPort: "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api-port\n  tls:\n    termination: edge\n    insecureEdgeTerminationPolicy: Allow\n  wildcardPolicy: None\n---\nEOF\n")])]),a("h2",[s._v("What does it give us?")]),a("p",[s._v("Well the perftest-toolkit creates 3scale resources like backends and products.\n"),a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/r4gojnww5tsmuzik3ack.png",alt:"3scale UI with load testing products and backends"}}),s._v("\nIt installs Hyperfoil(cli load testing tool)locally and on the remote ec2 instance. This can be accessed via the browser on the ec2 instance public address via port 8090 or directly on the ec2 instances\n"),a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/647hbuh2r1xv5l5gy9ck.png",alt:"hyperfoil cli in browser"}})]),a("p",[s._v("It uploads a benchmark yaml file like the following")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-yaml"}},[a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("name:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("3scale-benchmark")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("agents:")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("ec2-agent:")]),s._v(" \n    "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("host:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("ec2-54-93-91-242.eu-central-1.compute.amazonaws.com")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("port:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-number"}},[s._v("22")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("http:")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("host:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("https://perf-test-dwxpoent-3scale-apicast-production.apps.aucunnin-ccs.lpi0.s1.devshift.org:443")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("sharedConnections:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-number"}},[s._v("50")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("usersPerSec:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-number"}},[s._v("228")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("duration:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("3600s")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("maxDuration:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("3600s")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("scenario:")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("testSequence:")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("randomCsvRow:")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("file:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("/tmp/3scale.csv")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("skipComments:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'True'")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("removeQuotes:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'True'")]),s._v("\n     "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("columns:")]),s._v("\n       "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("0:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("target-host")]),s._v("\n       "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("1:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("uri")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("template:")]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("pattern:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("${target-host}:443")]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("toVar:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("target-authority")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("httpRequest:")]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("authority:")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("fromVar:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("target-authority")]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("GET:")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("fromVar:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("uri")]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("headers:")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("HOST:")]),s._v("\n          "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("fromVar:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("target-host")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("threads:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-number"}},[s._v("4")]),s._v("\n")])]),a("p",[s._v("It also uploads a csv with endpoint data to the /tmp directory on the ec2 instance which is consumed by the benchmark above.")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("cat 3scale.csv \n"),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"perf-test-dwxpoent-3scale-apicast-production.apps.aucunnin-ccs.lpi0.s1.devshift.org"')]),s._v(","),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"/pets?user_key=<some_user_key_from_3scale>"')]),s._v("\n")])]),a("p",[s._v("It will run the test automatically and returns a html report when done e.g. 0001.html")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z2vwrnfchxx61w5p95kw.gif",alt:"hyperfoil report in browser"}})]),a("h2",[s._v("Pain Points")]),a("p",[s._v("Firstly a couple of pain points. I needed to install docker on the ec2 instance as it was a Redhat RHEL 8 AIM I used the following commands on the ec2 instance")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("sudo yum-config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo &&\nsudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin &&\nsudo systemctl start docker &&\nsudo usermod -aG docker "),a("span",{pre:!0,attrs:{class:"hljs-variable"}},[s._v("$USER")]),s._v(" &&\nnewgrp docker\n")])]),a("p",[s._v("The version of Hyperfoil I was using requires "),a("code",{pre:!0},[s._v("id_rsa")]),s._v(" key pair on the ec2 instance, so I generated them and added the public key to the authorized_keys")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("cd")]),s._v(" ~/.ssh/\nssh-keygen -t rsa\ncat id_rsa.pub >> authorized_keys\n")])]),a("p",[s._v("There are few Ansible playbooks to run as part of the perftest-toolkit but I hit a few blockers when trying to run them. In the end I ended up using ansible-galaxy to install the missing collections")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# You may not have to do this ansible-galaxy collection list will show you if the are installed or not")]),s._v("\nansible-galaxy collection install ansible.posix\nansible-galaxy collection install community.docker\nansible-galaxy collection install community.general\n")])]),a("p",[s._v("In "),a("code",{pre:!0},[s._v("deployment/ansible.cfg")]),s._v(" I needed to point the ssh key to allow Ansible to access the ec2 instance via ssh so added the [ssh_connection] section. Updating this was in the readme but was missing the key")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-toml"}},[a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# project specific configuration for Ansible ")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-section"}},[s._v("[defaults]")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("inventory_plugins")]),s._v("=inventory\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("command_warnings")]),s._v("="),a("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("False")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-section"}},[s._v("[inventory]")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("enable_plugins")]),s._v("="),a("span",{pre:!0,attrs:{class:"hljs-number"}},[s._v("3")]),s._v("scale_inventory_plugin,ini\n\n"),a("span",{pre:!0,attrs:{class:"hljs-section"}},[s._v("[ssh_connection]")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("ssh_args")]),s._v(" = -o ServerAliveInterval="),a("span",{pre:!0,attrs:{class:"hljs-number"}},[s._v("30")]),s._v(" -i "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"~/.ssh/pem_key_name.pem"')]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("pipelining")]),s._v(" = "),a("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("True")]),s._v("\n")])]),a("p",[s._v("In "),a("code",{pre:!0},[s._v("deployment/roles/platform-setup/vars/RedHat.yml")]),s._v(" need to set the java version")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-yaml"}},[a("span",{pre:!0,attrs:{class:"hljs-meta"}},[s._v("---")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("java_package:")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("java-11-openjdk")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("unzip_package:")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("unzip")]),s._v("\n")])]),a("p",[s._v("One final pain point found that running Hyperfoil for longer runs 4 to 6 hours ended hitting up against some Garbage collection issue")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-json"}},[s._v("Error [\n"),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"ec2-agent: Jitter watchdog was not invoked for 109 ms; check GC settings."')]),s._v(",\n"),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"ec2-agent: Agent unexpectedly left the cluster."')]),s._v("\n]\n")])]),a("p",[s._v("Got around this by increasing the java memory settings with "),a("code",{pre:!0},[s._v("extras: -XX:+UseShenandoahGC -Xms1G -Xmx4G")]),s._v(" in the Hyperfoil benchmark to the max my ec2 instance could handle in this case 4GB. I updated "),a("code",{pre:!0},[s._v("deployment/benchmark/3scale-benchemark.yaml.j2")]),s._v(" as follows")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/crwu63rpepi8liosg363.png",alt:"Image description"}})]),a("h2",[s._v("Getting started")]),a("p",[s._v("Run the requirements playbook to install Hyperfoil locally")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("git "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("clone")]),s._v(" https://github.com/3scale-labs/perftest-toolkit\n"),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("cd")]),s._v(" deployment\nansible-galaxy install -r requirements.yaml\n")])]),a("p",[s._v("Next we edit a couple of files. First "),a("code",{pre:!0},[s._v("deployment/hosts")]),s._v(" we add in the ec2 instances public address")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-toml"}},[s._v("upstream ansible_host=ec2-54-93-91-242.eu-central-1.compute.amazonaws.com ansible_user=ec2-user\n\n"),a("span",{pre:!0,attrs:{class:"hljs-section"}},[s._v("[hyperfoil_controller]")]),s._v("\nec2 ansible_host=ec2-54-93-91-242.eu-central-1.compute.amazonaws.com ansible_user=ec2-user\n\n"),a("span",{pre:!0,attrs:{class:"hljs-section"}},[s._v("[hyperfoil_agent]")]),s._v("\nec2-agent ansible_host=ec2-54-93-91-242.eu-central-1.compute.amazonaws.com ansible_user=ec2-user\n")])]),a("p",[s._v("In the "),a("code",{pre:!0},[s._v("deployment/run.yml")]),s._v(" we set")]),a("ul",[a("li",[a("strong",[s._v("shared_connections")]),s._v(" (Hyperfoil setting number of concurrent connections to your load testing endpoint. A pain point if set to low Hyperfoil will fail the load test and if set to high can overload the test, you have to play around with it. Found for a 5 million request per day shared_connection of 30 worked where as 100 we see an increase in the 4xx error rate)")]),a("li",[a("strong",[s._v("users_per_sec")]),s._v(" (rate per second  e.g. 5 million request per day 5000,000÷60÷60÷24 = 57.87 so round to 58 rps)")]),a("li",[a("strong",[s._v("duration_sec")]),s._v(" (length of load test run in seconds)")])]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-yaml"}},[a("span",{pre:!0,attrs:{class:"hljs-meta"}},[s._v("---")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("hosts:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("hyperfoil_controller")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("roles:")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("hyperfoil.hyperfoil_test")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("vars:")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("test_name:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("3scale-benchmark")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("test_files:")]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"'),a("span",{pre:!0,attrs:{class:"hljs-template-variable"}},[s._v("{{ csv_dest_file_path }}")]),s._v('"')]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("shared_connections:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-number"}},[s._v("50")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("users_per_sec:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-number"}},[s._v("58")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("duration_sec:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-number"}},[s._v("3600")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("hosts:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("hyperfoil_controller")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("become:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("yes")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("roles:")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("hyperfoil_generate_report")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("hosts:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("hyperfoil_controller")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("tasks:")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("name:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("Retrieve")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("the")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("report")]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("fetch:")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("src:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"'),a("span",{pre:!0,attrs:{class:"hljs-template-variable"}},[s._v("{{ reports_path }}")]),s._v("/"),a("span",{pre:!0,attrs:{class:"hljs-template-variable"}},[s._v("{{ test_runid }}")]),s._v('.html"')]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("dest:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"'),a("span",{pre:!0,attrs:{class:"hljs-template-variable"}},[s._v("{{ playbook_dir }}")]),s._v("/"),a("span",{pre:!0,attrs:{class:"hljs-template-variable"}},[s._v("{{ toolkit_csv_file_path }}")]),s._v('/"')]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("flat:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("yes")]),s._v("\n")])]),a("p",[s._v("Next we need to populate the "),a("code",{pre:!0},[s._v("main.yml")]),s._v(" found in "),a("code",{pre:!0},[s._v("deployments/roles/profiled-traffic-generator/defaults/main.yml")]),s._v("\nYou need to get the 3scale-admin route, 3scale admin access token and the echo-api route")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("oc get routes -n <3scale-namespace-here> | grep 3scale-admin | awk "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'{print $2}'")]),s._v("\n3scale-admin.apps.aucunnin-ccs.lpi0.s1.devshift.org                                          \noc get secret system-seed -n <3scale-namespace-here> -o jsonpath="),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"{.data.ADMIN_ACCESS_TOKEN}"')]),s._v("| base64 --decode\n<Some_token>\noc get routes -n "),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api | awk "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'{print $2}'")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v("-api-echo-api.apps.aucunnin-ccs.lpi0.s1.devshift.org          \n")])]),a("p",[s._v("And add them to "),a("code",{pre:!0},[s._v("main.yml")]),s._v(" as follows")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-yaml"}},[a("span",{pre:!0,attrs:{class:"hljs-meta"}},[s._v("---")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# defaults file for profiled-traffic-generator")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# URI that includes your password and portal endpoint in the following format: <schema>://<password>@<admin-portal-domain>.")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# The <password> can be either the provider key or an access token for the 3scale Account Management API.")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# <admin-portal-domain> is the URL used to log into the admin portal.")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# Example: https://access-token@account-admin.3scale.net")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("threescale_portal_endpoint:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("https://<Some-token>@3scale-admin.apps.aucunnin-ccs.lpi0.s1.devshift.org/")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# Used traffic for performance testing is not real traffic.")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# It is synthetically generated traffic based on traffic models.")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# Information about available traffic profiles (or test plans) can be found here:")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# https://github.com/3scale/perftest-toolkit/blob/master/buddhi/README.md#profiles")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# Currently available profiles: [ simple | backend | medium | standard ]")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("traffic_profile:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("simple")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# Private Base URL")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# Make sure your private application behaves like an echo api service")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# example: https://echo-api.3scale.net:443")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("private_base_url:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("https://echo-api-echo-api.apps.aucunnin-ccs.lpi0.s1.devshift.org")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# Public Base URL")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# Public address of your API gateway in the production environment.")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# Optional. When it is left empty, public base url will be the hosted gateway url")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# example: https://gw.example.com:443")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("public_base_url:")]),s._v(" \n")])]),a("p",[a("strong",[s._v("Note")]),s._v(" we have selected the simple profile here as it's quickest to setup and is a single product and backend.Other profiles are "),a("code",{pre:!0},[s._v("backend, medium, standard")]),s._v(" with standard producing the most endpoints and being a slower setup.")]),a("p",[s._v("So once we have the hosts, run and main set we can run the following playbook which is basically setup and deployment jobs")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("ansible-playbook -i hosts profiled-injector.yml\n")])]),a("p",[s._v("Once completed you can run your test with this playbook")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("ansible-playbook -i hosts -i benchmarks/3scale.csv run.yml\n")])]),a("h2",[s._v("So how do you know it's working?")]),a("p",[s._v("You will see a polling in the Ansible output")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w3v1ov729gjfiw2zhrrp.png",alt:"ansible polling output"}})]),a("p",[s._v("The Ansible output above is showing that this is "),a("code",{pre:!0},[s._v("run/0001")]),s._v(" we can hit that endpoint using the ec2 public address and port 8090 and can check the status, below is an example of a  complete status")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h8us0bazi0vsnkqbl6x6.png",alt:"Check run via hyperfoil run endpoint"}})]),a("p",[s._v("You can ssh to the ec2 instance and access via the Hyperfoil cli in "),a("code",{pre:!0},[s._v("/tmp/hyperfoil/hyperfoile-0.15/bin")]),s._v(" and run the cli with "),a("code",{pre:!0},[s._v("./cli.sh")])]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g802bjayl8vcm0h26afz.png",alt:"Check run via hyperfoil CLI"}})]),a("p",[s._v("As stated above you should get a run html file each time you run the load test in the "),a("code",{pre:!0},[s._v("deployments/benchmarks")]),s._v(" directory which can be opened in the browser.")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zrpoz83bjve7leu52tx3.png",alt:"0000.html run file"}})]),a("p",[s._v("We can then gather things from the report like percentile response times, number of successful/failed request etc.")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/alwaur50t2bh8vxhr59o.png",alt:"report screenshot"}})])])}],r=a("2877"),l={},p=Object(r["a"])(l,e,n,!1,null,null,null);t["default"]=p.exports}}]);
//# sourceMappingURL=chunk-2d213196.ada1a599.js.map