# Upgrading Postgresql-v10 to v13 on Openshift

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/k42vumrw4xmdzhumwlig.png)

On Openshift v4 cluster I am looking to upgrade Postgresql-v10 to Postgersql-V13. For the sake of this blog I will spin up a Posgresql-v10 first via the Openshift templates

![create a postgresql v10 via Openshift templates](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rgywm33xr78g12q1nkxq.gif)
>**NOTE:** I am using quay.io registry here, you can use the [Red Hat certified images](https://catalog.redhat.com/software/containers/search?q=postgresql&p=1) also

Can we just change the image in the deploymentConfig to `quay.io/centos7/postgresql-13-centos7` ?

Unfortunately your postgresql pod will crash with the following error
```bash
Incompatible data directory. This container image provides
PostgreSQL '13', but data directory is of
version '10'.
This image supports automatic data directory upgrade from
'12', please _carefully_ consult image documentation
about how to use the '$POSTGRESQL_UPGRADE' startup option.
```
This does give us a hit on how to solve the issue but it looks like we need to upgrade through the versions of Postgresql. After a bit of reading about [$POSTGRESQL_UPGRADE](https://catalog.redhat.com/software/containers/rhel8/postgresql-12/5db133bd5a13461646df330b) we have two options for this env var, **copy** and **hardlink**. Using **copy** seems to be the lowest risk upgrade. I  found we can go from
- Postgresql 10 - 12
- Postgresql 12 - 13

>**NOTE:** $POSTGRESQL_UPGRADE does come with the usually warnings about backing up your data before upgrading your DB. And you should be comfortable with restoring from a back up. 

## Postgresql 10 to 12
Before we can patch the deployment config image we need to remove the imageChange deployment config trigger as it will revert any image change
```bash
# remove all
oc set triggers dc/postgresql --remove-all
# add back in the config change trigger
oc set triggers dc/postgresql --from-config
```
We can then patch the image in the deployment config to v12 `quay.io/centos7/postgresql-12-centos7` with this ugly one-liner patch command
```bash
oc patch dc postgresql -n postgresql-test --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"quay.io/centos7/postgresql-12-centos7"}]'
```
This will cause a new roll out.
>**NOTE:** I use a lot of cli commands as I am looking to eventually automate this in a script. You can also achieved the same by manually editing the image in the deploymentConfig. 

The roll out will have a pod in crashloopbackoff due to not having the `$POSTGRESQL_UPGRADE` env var set. We can  set the environment variable in the deploymentConfig with the following command
```bash
oc set env dc/postgresql -n postgresql-test POSTGRESQL_UPGRADE=copy
``` 
This will cause another roll out. Occasionally I found that this upgrade can fail with the following error
```bash
pg_ctl: another server might be running; trying to start server anyway
waiting for server to start....2023-02-03 14:14:21.615 UTC [45] FATAL:  lock file "postmaster.pid" already exists
```
So the long and the short of it is there is a lock file in place in postgresql and we need to shut down the postgresql service correctly to remove it. I ran the following commands before I set the `$POSTGRESQL_UPGRADE` env var.
```bash
# get the non deployment pod name
POD=$(oc get po --all-namespaces | grep "postgresql-" | awk '{print $2}' | grep -wv deploy)
# first stop the postgres service note the paths used in the commands the postgresql database name 'userdata' in this case
oc exec -it $POD -c postgresql -n postgresql-test -- /usr/bin/pg_ctl stop -D /var/lib/pgsql/data/userdata
# then remove the lock file to be sure
oc exec -it $POD -c system-postgresql -n $THREESCALE_NS  -- rm /var/lib/pgsql/data/userdata/postmaster.pid
 ```
 
I found that once the upgrade is finished the `$POSTGRESQL_UPGRADE` env var being set can cause some problems with future roll outs of the deploymentConfig e.g.
```bash
== WARNING!! ==
PostgreSQL server version matches the datadir PG_VERSION.
The $POSTGRESQL_UPGRADE makes no sense and you probably
made some mistake, keeping the variable set you might
risk a data loss in future!
===============
```
So we must unset the `$POSTGRESQL_UPGRADE` env var 
```bash
oc set env dc/postgresql -n postgresql-test POSTGRESQL_UPGRADE-
```
This will cause another roll out and that will be stable with v12 installed. To confirm the upgrade was successful you can run the following command
```bash
# run a postgres -V on the pod for postgresql, command finds the only pod that is not the deploy pod
oc exec -it $(oc get po --all-namespaces | grep "postgresql-" | awk '{print $2}' | grep -wv deploy) -n postgresql-test -- postgres -V
# should give you the version
postgres (PostgreSQL) 12.7
```

## Postgresql 12 to 13
We can apply the same steps again for 12 to 13. First patch the image in the deploymentConfig to `quay.io/centos7/postgresql-13-centos7` again with the patch command
```bash
oc patch dc postgresql -n postgresql-test --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"quay.io/centos7/postgresql-13-centos7"}]'
```

Again postgresql pod will crash with the following error
```bash
Incompatible data directory. This container image provides
PostgreSQL '13', but data directory is of
version '12'.
This image supports automatic data directory upgrade from
'12', please _carefully_ consult image documentation
about how to use the '$POSTGRESQL_UPGRADE' startup option.
```
set the environment variable with the following command
```bash
oc set env dc/postgresql -n postgresql-test POSTGRESQL_UPGRADE=copy
``` 
This will cause another roll out. 

Again you need to unset the `$POSTGRESQL_UPGRADE` env var to avoid issues on future roll outs

```bash
oc set env dc/system-postgresql -n postgresql-test POSTGRESQL_UPGRADE-
```
This will cause another roll out and that will be stable with v13 installed.
```bash
# run a postgres -v on the none deployment pod for posgres
oc exec -it $(oc get po --all-namespaces | grep "postgresql-" | awk '{print $2}' | grep -wv deploy) -n postgresql-test -- postgres -V
# should give you the version
postgres (PostgreSQL) 13.3
```
All in all it took 7 changes to the deploymentConfig to successfully upgrade. 

