![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qo9opg3zp6hflu0tloj3.png)

I wanted to monitor my Internet uptime and graph it over time on my PC which is on Fedora 39. I gave some taught to running ping scripts but these didn't meet my needs. After a bit of research I found that Prometheus has all the tools I need. First Installed Prometheus first I tried dnf but that failed
```bash
sudo dnf install -y prometheus
No match for argument: prometheus
Error: Unable to find a match: prometheus
```
So I installed from the [binary](https://prometheus.io/download/) when it's downloaded you get two binarys Prometheus,Promtool and a config file prometheus.yml after I extracted these I moved the binary to `/usr/local/bin` and the config file to `/etc/prometheus/`
```bash
sudo cp prometheus /usr/local/bin
sudo cp promtool /usr/local/bin
sudo cp prometheus.yml /etc/prometheus
```
I simplified my config prometheus.yml to two job one for prometheus and one for node_exporter(we will get to this in a while)
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "node_exporter"
    static_configs:
      - targets: ["localhost:9100"]
```
Make sure a prometheus user exists and has permissions to run the prometheus service
```bash
# check the user exists
id prometheus
uid=977(prometheus) gid=971(prometheus) groups=971(prometheus)
# add permissions to prometheus files
sudo chown -R prometheus:prometheus /etc/prometheus /var/lib/prometheus
sudo chown prometheus:prometheus /usr/local/bin/prometheus
```
I then created a service file which points at the binary and the config file and the storage destination
```bash
sudo vi /etc/systemd/system/prometheus.service
```
with the following contents
```toml
[Unit]
Description=Prometheus
After=network.target

[Service]
User=prometheus
Group=prometheus
ExecStart=/usr/local/bin/prometheus --config.file=/etc/prometheus/prometheus.yml --storage.tsdb.path=/var/lib/prometheus/

[Install]
WantedBy=multi-user.target
```
I then started the prometheus service
```bash
sudo systemctl enable --now prometheus
Created symlink /etc/systemd/system/multi-user.target.wants/prometheus.service → /etc/systemd/system/prometheus.service.
```

I needed to also install `node_exporter` to expose machine metrics from my local PC, fortunately dnf worked for this so no messing around with moving binarys and setting up config files and services 
```bash
sudo yum install -y node_exporter
```
I could start the service out of the box
```bash
sudo systemctl enable --now node_exporter
Created symlink /etc/systemd/system/multi-user.target.wants/prometheus-node-exporter.service → /usr/lib/systemd/system/prometheus-node-exporter.service.
```
I now had the prometheus ui up and running with metrics exposed from the PC on http://localhost:9090 .

![animated gif showing the available metrics in the prometheus ui](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/qfuin7wbra203y3ovo4a.gif)

I needed a way to get my internet up time. Prometheus itself doesn't have a way to ping a remote service but it does have a package that can do this called `blackbox_exporter`. I tried installing with dnf but it failed
```bash
sudo dnf install blackbox_exporter
No match for argument: blackbox_exporter
Error: Unable to find a match: blackbox_exporter
```
The binary was available for download at the [prometheus download site](https://prometheus.io/download/). So after I downloaded and extracted it I had a binary blackbox_exporter and a config file blackbox.yml. Similar process to before I copied the binary to `/usr/local/bin` and copied the config to `/etc`. Again I created a service 
```bash
sudo vi /etc/systemd/system/blackbox_exporter.service
```
With the following contents
```toml
[Unit]
Description=Blackbox Exporter
After=network.target

[Service]
ExecStart=/usr/local/bin/blackbox_exporter --config.file=/etc/blackbox.yml
Restart=always
User=blackbox
Group=blackbox

[Install]
WantedBy=multi-user.target
```
But when I attempted to start the service it failed as I hadn't setup the User and group as the status tells me
```bash
sudo systemctl enable --now blackbox_exporter        
sudo systemctl status blackbox_exporter        
× blackbox_exporter.service - Blackbox Exporter
     Loaded: loaded (/etc/systemd/system/blackbox_exporter.service; enabled; preset: disabled)
    Drop-In: /usr/lib/systemd/system/service.d
             └─10-timeout-abort.conf
     Active: failed (Result: exit-code) since Fri 2025-02-28 08:28:12 GMT; 7s ago
   Duration: 1ms
    Process: 323975 ExecStart=/usr/local/bin/blackbox_exporter --config.file=/etc/blackbox.yml (code=exited, status=216/GROUP)
   Main PID: 323975 (code=exited, status=216/GROUP)
        CPU: 907us

Feb 28 08:28:12 fedora systemd[1]: blackbox_exporter.service: Scheduled restart job, restart counter is at 5.
Feb 28 08:28:12 fedora systemd[1]: blackbox_exporter.service: Start request repeated too quickly.
Feb 28 08:28:12 fedora systemd[1]: blackbox_exporter.service: Failed with result 'exit-code'.
Feb 28 08:28:12 fedora systemd[1]: Failed to start blackbox_exporter.service - Blackbox Exporter.
```
So first I checked the blackbox user exists and created them and gave them permissions to the binary and config file 
```bash
# check the user
id blackbox
id: ‘blackbox’: no such user
# create the user
sudo useradd -r -s /bin/false blackbox
# confirm they were create 
id blackbox                           
uid=976(blackbox) gid=970(blackbox) groups=970(blackbox)
# give ownership to blackbox user and group the blackbox binary and config file
sudo chown blackbox:blackbox /usr/local/bin/blackbox_exporter
sudo chown blackbox:blackbox /etc/blackbox.yml         
# restart daemon and service
sudo systemctl daemon-reload
sudo systemctl restart blackbox_exporter
# check the status
sudo systemctl status blackbox_exporter
# status is good
● blackbox_exporter.service - Blackbox Exporter
     Loaded: loaded (/etc/systemd/system/blackbox_exporter.service; enabled; preset: disabled)
    Drop-In: /usr/lib/systemd/system/service.d
             └─10-timeout-abort.conf
     Active: active (running) since Fri 2025-02-28 08:31:09 GMT; 7s ago
   Main PID: 324468 (blackbox_export)
      Tasks: 10 (limit: 76747)
     Memory: 21.3M
        CPU: 10ms
     CGroup: /system.slice/blackbox_exporter.service
             └─324468 /usr/local/bin/blackbox_exporter --config.file=/etc/blackbox.yml

Feb 28 08:31:09 fedora systemd[1]: Started blackbox_exporter.service - Blackbox Exporter.
Feb 28 08:31:09 fedora blackbox_exporter[324468]: time=2025-02-28T08:31:09.098Z level=INFO source=main.go:86 msg="Starting blackbox_exporter" version=">
Feb 28 08:31:09 fedora blackbox_exporter[324468]: time=2025-02-28T08:31:09.098Z level=INFO source=main.go:87 msg="(go=go1.23.6, platform=linux/amd64, u>
Feb 28 08:31:09 fedora blackbox_exporter[324468]: time=2025-02-28T08:31:09.099Z level=INFO source=main.go:99 msg="Loaded config file"
Feb 28 08:31:09 fedora blackbox_exporter[324468]: time=2025-02-28T08:31:09.099Z level=INFO source=tls_config.go:347 msg="Listening on" address=[::]:9115
Feb 28 08:31:09 fedora blackbox_exporter[324468]: time=2025-02-28T08:31:09.099Z level=INFO source=tls_config.go:350 msg="TLS is disabled." http2=false >
```
Now I can confirm that the blackbox_exporter is working with the following curl command and it should return metrics
```bash
curl -s "http://localhost:9115/probe?module=icmp&target=8.8.8.8" 
# HELP probe_dns_lookup_time_seconds Returns the time taken for probe dns lookup in seconds
# TYPE probe_dns_lookup_time_seconds gauge
probe_dns_lookup_time_seconds 9.23e-06
# HELP probe_duration_seconds Returns how long the probe took to complete in seconds
# TYPE probe_duration_seconds gauge
probe_duration_seconds 0.010457657
# HELP probe_icmp_duration_seconds Duration of icmp request by phase
# TYPE probe_icmp_duration_seconds gauge
probe_icmp_duration_seconds{phase="resolve"} 9.23e-06
probe_icmp_duration_seconds{phase="rtt"} 0.010111051
probe_icmp_duration_seconds{phase="setup"} 0.000212389
# HELP probe_icmp_reply_hop_limit Replied packet hop limit (TTL for ipv4)
# TYPE probe_icmp_reply_hop_limit gauge
probe_icmp_reply_hop_limit 57
# HELP probe_ip_addr_hash Specifies the hash of IP address. It's useful to detect if the IP address changes.
# TYPE probe_ip_addr_hash gauge
probe_ip_addr_hash 2.350491669e+09
# HELP probe_ip_protocol Specifies whether probe ip protocol is IP4 or IP6
# TYPE probe_ip_protocol gauge
probe_ip_protocol 4
# HELP probe_success Displays whether or not the probe was a success
# TYPE probe_success gauge
probe_success 1
```
Ok I am seeing metrics returned. We next need to add these metrics to prometheus. For this we need to add a job to the `/etc/prometheus/prometheus.yml` config file so we edit the config scrape_config so the file looks like 

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "blackbox"
    metrics_path: /probe
    params:
      module: [icmp]  # this module is defined in the /etc/blackbox.yml file
    static_configs:
      - targets:
          - "8.8.8.8"  # Google DNS (change to another IP to monitor)
          - "8.8.4.4" 
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: localhost:9115
  
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  - job_name: "node_exporter"
    static_configs:
      - targets: ["localhost:9100"]
```
> **NOTE:** this would be good to monitor any web page or services ip address by updating the target list for now we will stick to the google dns. See [Prometheus docs](https://prometheus.io/docs/guides/multi-target-exporter/) for more info

Once this is updated restart the prometheus service
```bash
sudo systemctl restart prometheus
```
The result on localhost:9090 we can check the `up` metric to see if our internet is up over time 1 is good 0 is bad. 

![Prometheus ui showing the up metric](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8tcd61z79ovgqjbblufr.png)

I installed grafana to get a prettier graph, dnf worked
```bash
sudo dnf install grafana
```
The Grafana services was running on http://localhost:3000/ logged in with the default user admin and the default password admin, was asked to update the password by the ui. I had an issue adding the Prometheus data source , Was seeing the follow error 

```bash
Error reading Prometheus: Get "http://127.0.0.1:9090/api/v1/query?query=1%2B1&time=1740751852.139": dial tcp 127.0.0.1:9090: connect: permission denied
```

After a lot of messing around found it was a selinux restriction as I could connect to the datasource when selinux was disabled

```bash
# works when this is disabled
sudo setenforce 0
# doesn't when enabled
sudo setenforce 1
# checked the journalctl log
sudo journalctl -t setroubleshoot | tail -20
Feb 28 14:25:33 fedora setroubleshoot[359567]: SELinux is preventing grafana-server from name_connect access on the tcp_socket port 9090.
                                               
                                               *****  Plugin catchall_boolean (89.3 confidence) suggests   ******************
                                               
                                               If you want to allow grafana to can tcp connect prometheus port
                                               Then you must tell SELinux about this by enabling the 'grafana_can_tcp_connect_prometheus_port' boolean.
                                               
                                               Do
                                               setsebool -P grafana_can_tcp_connect_prometheus_port 1
                                               
                                               *****  Plugin catchall (11.6 confidence) suggests   **************************
                                               
                                               If you believe that grafana-server should be allowed name_connect access on the port 9090 tcp_socket by default.
                                               Then you should report this as a bug.
                                               You can generate a local policy module to allow this access.
                                               Do
                                               allow this access for now by executing:
                                               # ausearch -c 'grafana-server' --raw | audit2allow -M my-grafanaserver
                                               # semodule -X 300 -i my-grafanaserver.pp
                                               
# I set the selinux bool as the first section of the journal log suggested
sudo setsebool -P grafana_can_tcp_connect_prometheus_port 1
```
And that was it was able to add the datasource in grafana.

![Image of datasource up in grafana ui](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/0ruildkjegcuwy07w3ra.png)

Sometimes you really get into the weeds. Anyway here is grafana dashboard

![Image of grafana up dashboard](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s1b8ny25oh7qy928nlkm.png)



 

