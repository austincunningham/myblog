(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0d607c"],{"718d":function(a,e,t){"use strict";t.r(e);var s=function(){var a=this,e=a.$createElement;a._self._c;return a._m(0)},r=[function(){var a=this,e=a.$createElement,t=a._self._c||e;return t("section",[t("h1",[a._v("Use Grafana to plot Express.js apps Metrics")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m8qa0ki1ulufkgsfia7a.png",alt:"banner image"}})]),t("p",[a._v("In this blog "),t("a",{attrs:{href:"https://austincunningham.ddns.net/2021/expressprometheus"}},[a._v("get-prometheus-metrics-from-a-express-js-app")]),a._v(" I exposed the metrics from an Express.js app to Prometheus. Now I am going to used these metrics in Grafana.")]),t("h2",[a._v("Install Grafana")]),t("p",[a._v("Create a new project")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[a._v("oc new-project grafana\n")])]),t("p",[a._v("We can use the OperatorHub in Red Hat Openshift to install the Grafana-operator. I have logged in as kubeadmin user,and navigate to the OperatorHub and search for Grafana")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h3ul6hk9x5lfodx2d0ch.png",alt:"screenshot of Grafana in operatorhub"}})]),t("p",[a._v("Select the Grafana tile and continue on the install screen select install button")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5jqs9x4h0j02k6a1xf4v.png",alt:"screenshot of install button"}})]),t("p",[a._v("In the next screen select the grafana namespace and click install again")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/64v3k1r81gdv2zadezh2.png",alt:"screenshot of namespace selector"}})]),t("p",[a._v("The operator should complete installing once finished go to the view operator button")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4a8z5k4cad7w7tkx35jn.png",alt:"View operator button"}})]),t("p",[a._v("We need to create a CR(custom resource) for Grafana to create a Grafana instance in the Grafana tile click on the create instance link")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/un159zkw14ysts5i7wrk.png",alt:"screenshot of grafana CR tile"}})]),t("p",[a._v("This will bring you to a form to populate the Grafana CR I just add a name and click create button")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mxo5gnal17wzz9d257an.png",alt:"screenshot of grafana CR form"}})]),t("p",[a._v("Thats it the Grafana instance should start, there is also a route created in the Grafana namespace.")]),t("h2",[a._v("Connecting to prometheus")]),t("p",[a._v("Open the Grafana route in the browser")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[a._v("oc project grafana\noc get routes\nNAME            HOST/PORT                                PATH   SERVICES          PORT   TERMINATION   WILDCARD\ngrafana-route   grafana-route-grafana.apps-crc.testing          grafana-service   3000   edge          None\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[a._v("# the HOST/PORT is the route so http://grafana-route-grafana.apps-crc.testing should open the grafana console")]),a._v("\n")])]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mw1a5v8m2uzh0quzok51.png",alt:"screenshot of Grafana"}})]),t("p",[a._v("We will need to login to Grafana to be able to do anything. You can get the credentials for grafana in the Grafana CR")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[a._v("oc get grafana grafana -o yaml | grep admin\n            f:admin_password: {}\n            f:admin_user: {}\n      admin_password: secret\n      admin_user: root\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[a._v("# You can edit the secret in the Grafana CR also to change it from the default. ")]),a._v("\n")])]),t("p",[a._v("Select the Sign In on the bottom of the screen")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lohxk3vzszycznxak816.png",alt:"sign in "}})]),t("p",[a._v("And used the admin credentials in the login screen")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4h5k7ilaw1qi96dcbvce.png",alt:"Login screen"}})]),t("p",[a._v("We can now connect Grafana to Prometheus by adding a data source. Go to the now available gear icon, and select Data Source and select Prometheus as show below")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/617p5ax5ikmbtmd67m8z.gif",alt:"navigate to add prometheus datasource"}})]),t("p",[a._v("In the Data Source form in the HTML section add url for the Prometheus service. The service url is in the following format.")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[t("span",{pre:!0,attrs:{class:"hljs-comment"}},[a._v("# service-name.service-namespace.svc:port")]),a._v("\nhttp://prometheus.default.svc:9090\n")])]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i2l4x2tsj0kg5fxa2gri.gif",alt:"Add data source url"}})]),t("p",[a._v("You can now see prometheus metrics in grafana.")]),t("h2",[a._v("Add some useful metrics to Grafana")]),t("p",[a._v("You can play around with the Grafana UI to get familiar with it creating dashboards and panels or read the "),t("a",{attrs:{href:"https://grafana.com/docs/grafana/latest/panels/add-a-panel/"}},[a._v("Grafana docs")]),a._v(". Mainly its about adding the Prometheus expressions and pointing at the right data source.")]),t("p",[t("strong",[a._v("http_request_duration_seconds_bucket")]),a._v("\nOne of the metrics we get from the Express.js app is http_request_duration_seconds_bucket. When we use this metric Grafana prompts us to use "),t("a",{attrs:{href:"https://prometheus.io/docs/practices/histograms/#quantiles"}},[a._v("Histogram_quantile")]),a._v(" with this metric.")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oh4cpv496kp7ey0ie93k.gif",alt:"http_request_duration_seconds_bucket"}})]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[t("span",{pre:!0,attrs:{class:"hljs-comment"}},[a._v("# Prometheus Expression aggregates the 95th percentile")]),a._v("\nhistogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))\n")])]),t("p",[a._v("As you can see I'm not seeing anything on the graph. This is because I am not generating any traffic. I wrote a small script to hit the endpoints.")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[a._v("while")]),a._v(" "),t("span",{pre:!0,attrs:{class:"hljs-literal"}},[a._v("true")]),a._v("; \n"),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[a._v("do")]),a._v("\n\tcurl http://example-app-default.apps-crc.testing/\n\tcurl http://example-app-default.apps-crc.testing/hello\n\tcurl -X POST -H "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[a._v('"Content-Type: application/json"')]),a._v(" -d "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[a._v('\'{"name": "test", "email": "test@example.com"}\'')]),a._v(" http://example-app-default.apps-crc.testing/"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[a._v("bye")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[a._v("done")]),a._v("\n")])]),t("p",[a._v("After a few minutes I am seeing the metric show up")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tlyg5tq6ai7feprsprof.png",alt:"screenshot of metrics"}})]),t("p",[t("strong",[a._v("Up")]),a._v("\nI use this metric to determine if the container pods are up and running. As there should be 3 pods we sum the up's and divide by 3 to get a single metric , and add it to Grafana as a gauge panel.")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f0esw9aljrlxuxzln4q7.png",alt:"Container Up graph"}})]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[t("span",{pre:!0,attrs:{class:"hljs-comment"}},[a._v("# Prometheus expression ")]),a._v("\nsum(up)/3\n")])]),t("p",[t("strong",[a._v("Average request duration Express-prometheus")]),a._v("\nThe Average request duration can be got by the following expression see "),t("a",{attrs:{href:"https://prometheus.io/docs/practices/histograms/#count-and-sum-of-observations"}},[a._v("prometheus docs")]),a._v(" for more info.")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[t("span",{pre:!0,attrs:{class:"hljs-comment"}},[a._v("# Prometheus expression")]),a._v("\nrate(http_request_duration_seconds_sum[5m])/ rate(http_request_duration_seconds_count[5m])\n")])]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5uauqd6vacb6pr4dwey9.png",alt:"Average request duration graph"}})]),t("p",[t("strong",[a._v("Memory Metrics")]),a._v("\nThere are a lot of memory metrics exposed by the Express.js app.")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zjyw8fxgozpew0knfzms.png",alt:"memory metrics"}})]),t("p",[a._v("You can use any of these metrics for a panel.\nIn my example will use the Memory Heap Used vs Heap Total.")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[t("span",{pre:!0,attrs:{class:"hljs-comment"}},[a._v("# Prometheus expressions")]),a._v("\nnodejs_heap_size_used_bytes\nnodejs_heap_size_total_bytes\n")])]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/46ty28qkbj21g5i4ybvx.png",alt:"Memory Heap Used vs Heap Total graph"}})]),t("p",[a._v("Adding the two metric to the panel")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mx0rvpom2w4u2w4i4o9r.png",alt:"add two metrics screenshot"}})]),t("p",[t("strong",[a._v("CPU Metrics")]),a._v("\nWith CPU again there are a few metrics exposed from the Express.js app. Again when we add the CPU metric Grafana prompts us to use these metrics with rate")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/trz7osynfqpl0m2l1dj2.png",alt:"change to cpu rate"}})]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[t("span",{pre:!0,attrs:{class:"hljs-comment"}},[a._v("## Prometheus expressions")]),a._v("\nrate(process_cpu_seconds_total[5m])\nrate(process_cpu_system_seconds_total[5m])\nrate(process_cpu_user_seconds_total[5m])\n")])]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gk5rd2nu1xj8yxnejr21.png",alt:"CPU Process graph"}})]),t("h2",[a._v("Dashboard")]),t("p",[a._v("Finally the Dashboard looks as follows")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/459r3wbi2n7rwmy9scxo.png",alt:"Dashboard View"}})])])}],o=t("2877"),n={},p=Object(o["a"])(n,s,r,!1,null,null,null);e["default"]=p.exports}}]);
//# sourceMappingURL=chunk-2d0d607c.ef737e54.js.map