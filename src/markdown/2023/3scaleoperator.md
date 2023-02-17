# Kicking the tyres of 3scale API Management with the operator

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g1pthz5lq9o4vfvfqhtb.png)

This is a shameless plug as I work on this product. This is a quick startup guide for getting 3scale up and running quickly with the 3scale-operator. This is not a production configuration and doesn't cover all configuration options. 

## Install with the 3scale-operator
First we create a project
```bash
oc new-project 3scale-test
```
In the Openshift Administrator view we can then use the Operatorhub to install the 3scale operator into the project

![Install 3scale via the operatorhub](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xzicxnw321dq040zw7vd.gif)

Once installed we can create an APIManager CR to create an instance of 3scale. To do this we need a wildCardDomain that is resolvable in Openshift. You can setup a custom domain or you can use the Openshift default application router which I will used. This can be got from your Openshift console route  e.g.
 
console-openshift-console.**apps.aucunnin.4mog.s1.devshift.org**

You also need an [s3 bucket setup](https://access.redhat.com/documentation/en-us/red_hat_3scale_api_management/2.8/html/installing_3scale/install-threescale-on-openshift-guide#configuring_amazon_simple_storage_service). This bucket is used for storing CMS data for the customer web portal which I won't be covering in this blog. So once you have the bucket setup you will need its buck id , region and AWS key and secret. We create a secret in the project namespace

```yaml
kind: Secret
apiVersion: v1
metadata:
  name: s3-credentials
  namespace: 3scale-test
data:
  AWS_ACCESS_KEY_ID: UkVQTEFDRV9NRQ==
  AWS_BUCKET: UkVQTEFDRV9NRQ==
  AWS_REGION: UkVQTEFDRV9NRQ==
  AWS_SECRET_ACCESS_KEY: UkVQTEFDRV9NRQ==
type: Opaque
```
the values are base64 encoded e.g.
```bash
echo UkVQTEFDRV9NRQ== | base64 -d
REPLACE_ME
```
Once the secret is created you can create the APIManager CR
```yaml
apiVersion: apps.3scale.net/v1alpha1
kind: APIManager
metadata: 
  name: apimanager-sample
  namespace: 3scale-test
spec: 
  system: 
    fileStorage: 
      simpleStorageService: 
        configurationSecretRef: 
          name: s3-credentials
  wildcardDomain: apps.aucunnin.4mog.s1.devshift.org
```
Once the CR is created it should install 3scale. You can confirm the install is finished by checking the APIManager CR status , should look like the following.
```bash
# using https://mikefarah.gitbook.io/yq/
oc get apimanager apimanager-sample -oyaml | yq '.status'
conditions:
  - lastTransitionTime: "2023-02-17T14:29:27Z"
    status: "True"
    type: Available
deployments:
  ready:
    - apicast-production
    - apicast-staging
    - backend-cron
    - backend-listener
    - backend-redis
    - backend-worker
    - system-app
    - system-memcache
    - system-mysql
    - system-redis
    - system-sidekiq
    - system-sphinx
    - zync
    - zync-database
    - zync-que
```
## Login to 3scale
Once we reach this point we can play around with 3scale. We can use the **3scale-admin** route or the **master** route to log in the credentials for these are in the **system-seed** secret. I will use the admin route .

Route

![3scale-admin route](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/swvzkrwkdnuqrqnm1g1n.png)

Password

![system-seed secret](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ypa9mkr3quvjibytqfb0.gif)

Click on the route and login as **admin** with the copied password and go through the welcome wizard.

![login plus wizard](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/gk3l0ayfcd9dtpgmkohg.gif)

## Add your own API
I am going to use a free API to demo this
```bash
curl -k https://catfact.ninja/fact  
{"fact":"Both humans and cats have identical regions in the brain responsible for emotion.","length":81}% 
```
### Create a Backend
From the dashboard click on **Create Backend** and fill out the form adding a valid api. 

![Add a backend](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/h26xnnfjht5lv3xxmd0c.gif)

### Create a Product
From the dashboard click on **Create Backend** and fill out the form

![Add a product](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mhdqug12qjomy7c5neew.gif)

### Add Application Plan
From the Product screen select **Application** and **Application Plan** and fill out the form, you can add thing like price plans, trial periods etc.  

![Create an application plan](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rds6zglnv1fl4umxx6pc.gif)

### Add an Application
From the Product screen select **Application** and **Listing** and then the **Create Application** button and fill out the form again

![create an application](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fkgn6jaszr03urohp7mt.gif)

### Link your Backend to your Product
From the dashboard click on the product you created earlier, Click on **Integration\Configuration** and add the backend to your product.

![Link your backend to your product](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x2o068eodo0vxgr1sp8y.gif)

### Promote to staging and production
From the products screen click on **Integration\Configuration** again and click on the button to promote to staging and production

![promote to staging and production](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/x6ard5bsd8h03mf8w1br.gif)

You can check the staging url out with the curl command e.g.
```bash
curl "https://catfact-3scale-apicast-staging.apps.aucunnin.4mog.s1.devshift.org:443/?user_key=073a4f36364b635c156811dcc1728d32"
{"fact":"Phoenician cargo ships are thought to have brought the first domesticated cats to Europe in about 900 BC.","length":105}%
```
That it for kicking the tyres , there is a lot more you can add to your product such as analytics, metrics, policies, API docs\ActiveDocs. There are plenty of other features but I won't go into them as I would just be covering what is already in the [docs](https://access.redhat.com/documentation/en-us/red_hat_3scale_api_management/2.10) 