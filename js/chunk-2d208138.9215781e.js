(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d208138"],{a2f7:function(e,a,s){"use strict";s.r(a);var t=function(){var e=this,a=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,a=e.$createElement,s=e._self._c||a;return s("section",[s("h1",[e._v("Automate 3scale monitoring stack deployment")]),s("p",[e._v("published: false\ndescription: Automate 3scale monitoring stack deployment")]),s("p",[s("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/205920ypz4m1edbb4n65.png",alt:"Banner image with prometheus, grafana and 3scale logo"}})]),s("p",[e._v("I wanted to automate the deployment the a monitoring stack for 3scale which is documented "),s("a",{attrs:{href:"https://github.com/3scale/3scale-operator/tree/master/doc/monitoring-stack-deployment"}},[e._v("here")]),e._v(" as there were a lot of manual steps.")]),s("p",[e._v("First I clone the 3scale-operator repo as I need access to files there. I already have 3scale-operator setup in the "),s("code",{pre:!0},[e._v("3scale-test")]),e._v(" project so I change to that project.")]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s("span",{pre:!0,attrs:{class:"hljs-meta"}},[e._v("#!/bin/bash")]),e._v("\ngit "),s("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("clone")]),e._v(" git@github.com:3scale/3scale-operator.git\n"),s("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("cd")]),e._v(" 3scale-operator/doc/monitoring-stack-deployment\noc project 3scale-test\n")])]),s("p",[e._v("There were a couple of steps that involved using the Openshift UI to install operators. I needed a way to deploy the Prometheus and Grafana operators from the command line. As this was an Openshift 4 Kubernetes cluster it had OLM(operator lifecycle manager) installed. So it was just a matter of creating subscriptions which is the resource that OLM is watching for to deploy operators. And I got the prometheus and grafana operators installed")]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("# Create a subscription for prometheus operator")]),e._v("\noc apply -f - <<EOF\n---\napiVersion: operators.coreos.com/v1alpha1\nkind: Subscription\nmetadata:\n  name: rhods-prometheus-operator\n  namespace: 3scale-test\nspec:\n  channel: beta\n  installPlanApproval: Automatic\n  name: rhods-prometheus-operator\n  "),s("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("source")]),e._v(": redhat-operators\n  sourceNamespace: openshift-marketplace\n  startingCSV: rhods-prometheus-operator.4.10.0\nEOF\n"),s("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("# Create Grafana Subscription")]),e._v("\noc apply -f - <<EOF\n---\napiVersion: operators.coreos.com/v1alpha1\nkind: Subscription\nmetadata:\n  name: grafana-operator\n  namespace: 3scale-test\nspec:\n  channel: v4\n  installPlanApproval: Automatic\n  name: grafana-operator\n  "),s("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("source")]),e._v(": community-operators\n  sourceNamespace: openshift-marketplace\n  startingCSV: grafana-operator.v4.10.1\nEOF\n"),s("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("# added a sleep to let the installs finish")]),e._v("\nsleep 60\n")])]),s("p",[e._v("You can see them installed in the Openshift UI")]),s("p",[s("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/40tp9u5i6lsi5kf46lv8.png",alt:"Installed opeators openshift UI"}})]),s("p",[e._v("You have to enable monitoring in the APIManger custom resource the following command does this.")]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("# patch apimanager called apimanger-sample CR monitoring enabled true")]),e._v("\noc patch apimanager apimanager-sample --"),s("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("type")]),e._v("="),s("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v("'json'")]),e._v(" -p="),s("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('\'[{"op": "add", "path": "/spec/monitoring", "value": {"enabled": true}}]\'')]),e._v("\n")])]),s("p",[e._v("This basically gets the 3scale-operator to deploy grafana and promentheus resources for monitoring 3scale i.e. grafana dashboards, prometheus alerts.")]),s("p",[e._v("Next came setting up the scrapeconfig that allows scraping monitoring data from the clusters monitoring stack. This requires getting a token from the Openshift monitoring stack and patching that token into the scrapconfig file and create a secret from that file. Steps outline below")]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("# Get the SECRET name that contains the THANOS_QUERIER_BEARER_TOKEN")]),e._v("\nSECRET=`oc get secret -n openshift-user-workload-monitoring | grep  prometheus-user-workload-token | head -n 1 | awk "),s("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v("'{print $1 }'")]),e._v("`\n"),s("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("# Get the THANOS_QUERIER_BEARER_TOKEN using the SECRET name")]),e._v("\nTHANOS_QUERIER_BEARER_TOKEN=$(oc get secret "),s("span",{pre:!0,attrs:{class:"hljs-variable"}},[e._v("$SECRET")]),e._v(" -n openshift-user-workload-monitoring -o jsonpath="),s("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('"{.data.token}"')]),e._v(" | base64 -d)\n"),s("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("# patch the THANOS_QUERIER_BEARER_TOKEN in the 3scale-scrape-configs.yaml")]),e._v("\nsed -i "),s("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('"s|<THANOS_QUERIER_BEARER_TOKEN>|'),s("span",{pre:!0,attrs:{class:"hljs-variable"}},[e._v("$THANOS_QUERIER_BEARER_TOKEN")]),e._v('|g"')]),e._v(" 3scale-scrape-configs.yaml\n"),s("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("# create secret addition-scrape-configs from 3scale-scrape-configs.yaml file")]),e._v("\noc create secret generic additional-scrape-configs --from-file=3scale-scrape-configs.yaml=./3scale-scrape-configs.yaml\n")])]),s("blockquote",[s("p",[s("strong",[e._v("NOTE:")]),e._v(" I have kubeadmin privilages, so I haven't investigated the minimum permissions required to get this secret")])]),s("p",[e._v("Next we need to set the route in the "),s("code",{pre:!0},[e._v("prometheus.yaml")]),e._v(" file and apply the file to create an instance of Prometheus and expose a route to access from the browser")]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("# Prometheus CR")]),e._v("\nDOMAIN=$(oc get routes console -n openshift-console -o json | jq -r "),s("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v("'.status.ingress[0].routerCanonicalHostname'")]),e._v(" | sed "),s("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v("'s/router-default.//'")]),e._v(")\nEXTERNALURL=https://prometheus.3scale-test."),s("span",{pre:!0,attrs:{class:"hljs-variable"}},[e._v("$DOMAIN")]),e._v("\nsed -i "),s("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('"s|externalUrl:.*|externalUrl: '),s("span",{pre:!0,attrs:{class:"hljs-variable"}},[e._v("$EXTERNALURL")]),e._v('|"')]),e._v(" prometheus.yaml\noc apply -f prometheus.yaml\nsleep 5\noc expose service prometheus-operated --hostname prometheus.3scale-test."),s("span",{pre:!0,attrs:{class:"hljs-variable"}},[e._v("$DOMAIN")]),e._v("\n")])]),s("p",[e._v("Then we can apply the grafana CR's(Custom Resources) to create an instance of the Grafana")]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("# Grafana CR's")]),e._v("\noc apply -f datasource.yaml\noc apply -f grafana.yaml\n")])]),s("p",[e._v("At this stage we should have a grafana and prometheus setup with all the 3scale monitoring available")]),s("p",[s("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uwot5xei389mr0w354s2.png",alt:"Prometheus Alerts"}})]),s("p",[s("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/d2ko8ae07r9nqjg6qnnm.png",alt:"Grafana Dashboards"}})]),s("p",[e._v("And finally clean up the operator that was cloned")]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("# remove 3scale-operator dir")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("cd")]),e._v(" ../../../\nrm -rf 3scale-operator\n")])]),s("p",[e._v("code lives "),s("a",{attrs:{href:"https://github.com/3scale-labs/3scale-perf-setup/blob/main/setup_monitoring.sh"}},[e._v("here")])]),s("blockquote",[s("p",[s("strong",[e._v("NOTE:")]),e._v(" this file also installs the prometheus-exporter to add a grafana dashboard for the backend redis.")])])])}],n=s("2877"),o={},p=Object(n["a"])(o,t,r,!1,null,null,null);a["default"]=p.exports}}]);
//# sourceMappingURL=chunk-2d208138.9215781e.js.map