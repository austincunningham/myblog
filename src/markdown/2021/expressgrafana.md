# Use Grafana to plot Express.js apps Metrics

![banner image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/m8qa0ki1ulufkgsfia7a.png)


In this blog [get-prometheus-metrics-from-a-express-js-app](https://austincunningham.ddns.net/2021/expressprometheus) I exposed the metrics from an Express.js app to Prometheus. Now I am going to used these metrics in Grafana.

## Install Grafana
Create a new project
```bash
oc new-project grafana
```
We can use the OperatorHub in Red Hat Openshift to install the Grafana-operator. I have logged in as kubeadmin user,and navigate to the OperatorHub and search for Grafana

![screenshot of Grafana in operatorhub](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h3ul6hk9x5lfodx2d0ch.png)

Select the Grafana tile and continue on the install screen select install button

![screenshot of install button](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5jqs9x4h0j02k6a1xf4v.png)

In the next screen select the grafana namespace and click install again

![screenshot of namespace selector](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/64v3k1r81gdv2zadezh2.png)

The operator should complete installing once finished go to the view operator button

![View operator button](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4a8z5k4cad7w7tkx35jn.png)

We need to create a CR(custom resource) for Grafana to create a Grafana instance in the Grafana tile click on the create instance link

![screenshot of grafana CR tile](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/un159zkw14ysts5i7wrk.png)

This will bring you to a form to populate the Grafana CR I just add a name and click create button 

![screenshot of grafana CR form](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mxo5gnal17wzz9d257an.png)

Thats it the Grafana instance should start, there is also a route created in the Grafana namespace.

## Connecting to prometheus
Open the Grafana route in the browser
```bash
oc project grafana
oc get routes
NAME            HOST/PORT                                PATH   SERVICES          PORT   TERMINATION   WILDCARD
grafana-route   grafana-route-grafana.apps-crc.testing          grafana-service   3000   edge          None
# the HOST/PORT is the route so http://grafana-route-grafana.apps-crc.testing should open the grafana console
```

![screenshot of Grafana](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mw1a5v8m2uzh0quzok51.png)

We will need to login to Grafana to be able to do anything. You can get the credentials for grafana in the Grafana CR
```bash
oc get grafana grafana -o yaml | grep admin
            f:admin_password: {}
            f:admin_user: {}
      admin_password: secret
      admin_user: root
# You can edit the secret in the Grafana CR also to change it from the default. 
```
Select the Sign In on the bottom of the screen

![sign in ](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lohxk3vzszycznxak816.png)

And used the admin credentials in the login screen

![Login screen](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4h5k7ilaw1qi96dcbvce.png)

We can now connect Grafana to Prometheus by adding a data source. Go to the now available gear icon, and select Data Source and select Prometheus as show below

![navigate to add prometheus datasource](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/617p5ax5ikmbtmd67m8z.gif)

In the Data Source form in the HTML section add url for the Prometheus service. The service url is in the following format. 

```bash
# service-name.service-namespace.svc:port
http://prometheus.default.svc:9090
```

![Add data source url](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/i2l4x2tsj0kg5fxa2gri.gif)

You can now see prometheus metrics in grafana.

## Add some useful metrics to Grafana 
You can play around with the Grafana UI to get familiar with it creating dashboards and panels or read the [Grafana docs](https://grafana.com/docs/grafana/latest/panels/add-a-panel/). Mainly its about adding the Prometheus expressions and pointing at the right data source. 

**http_request_duration_seconds_bucket**
One of the metrics we get from the Express.js app is http_request_duration_seconds_bucket. When we use this metric Grafana prompts us to use [Histogram_quantile](https://prometheus.io/docs/practices/histograms/#quantiles) with this metric.

![http_request_duration_seconds_bucket](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/oh4cpv496kp7ey0ie93k.gif)

```bash
# Prometheus Expression aggregates the 95th percentile
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

As you can see I'm not seeing anything on the graph. This is because I am not generating any traffic. I wrote a small script to hit the endpoints.

```bash
while true; 
do
	curl http://example-app-default.apps-crc.testing/
	curl http://example-app-default.apps-crc.testing/hello
	curl -X POST -H "Content-Type: application/json" -d '{"name": "test", "email": "test@example.com"}' http://example-app-default.apps-crc.testing/bye
done
```

After a few minutes I am seeing the metric show up

![screenshot of metrics](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/tlyg5tq6ai7feprsprof.png)

**Up**
I use this metric to determine if the container pods are up and running. As there should be 3 pods we sum the up's and divide by 3 to get a single metric , and add it to Grafana as a gauge panel.

![Container Up graph](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/f0esw9aljrlxuxzln4q7.png)

```bash
# Prometheus expression 
sum(up)/3
```

**Average request duration Express-prometheus**
The Average request duration can be got by the following expression see [prometheus docs](https://prometheus.io/docs/practices/histograms/#count-and-sum-of-observations) for more info.

```bash
# Prometheus expression
rate(http_request_duration_seconds_sum[5m])/ rate(http_request_duration_seconds_count[5m])
```

![Average request duration graph](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5uauqd6vacb6pr4dwey9.png)



**Memory Metrics**
There are a lot of memory metrics exposed by the Express.js app. 

![memory metrics](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zjyw8fxgozpew0knfzms.png)

You can use any of these metrics for a panel. 
In my example will use the Memory Heap Used vs Heap Total. 

```bash
# Prometheus expressions
nodejs_heap_size_used_bytes
nodejs_heap_size_total_bytes
```

![Memory Heap Used vs Heap Total graph](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/46ty28qkbj21g5i4ybvx.png)

Adding the two metric to the panel

![add two metrics screenshot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mx0rvpom2w4u2w4i4o9r.png)

**CPU Metrics**
With CPU again there are a few metrics exposed from the Express.js app. Again when we add the CPU metric Grafana prompts us to use these metrics with rate 

![change to cpu rate](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/trz7osynfqpl0m2l1dj2.png)

```bash
## Prometheus expressions
rate(process_cpu_seconds_total[5m])
rate(process_cpu_system_seconds_total[5m])
rate(process_cpu_user_seconds_total[5m])
```
![CPU Process graph](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gk5rd2nu1xj8yxnejr21.png)

## Dashboard
Finally the Dashboard looks as follows

![Dashboard View](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/459r3wbi2n7rwmy9scxo.png)
