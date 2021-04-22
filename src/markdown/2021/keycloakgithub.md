
# Setting up Keycloak using Github Identity provider in Express

![banner image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fwj1s9zqokkmdu16rxek.png)

First what is meant by by Identity provider? it's allowing a third party to handle your authentication to your application like Facebook, Github or Linkedin see keycloaks supported list below in image.

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s12p4md845hs83y7azaa.png)

Setting up idp is well documented [here](https://www.keycloak.org/docs/latest/server_admin/#social-identity-providers). 

In this example I will use Github. I have a previous blog detailing how to setup an [Express app with Keycloak](https://austincunningham.ddns.net/2017/keycloakexpress). This basically covers setting up a keycloak realm , client,  user, and adding the keycloak.json to your express app and using the [keycloak-connect module](https://www.npmjs.com/package/keycloak-connect). 

Once you have your app setup with Keycloak you can add an identity provider. 

In Keycloak select `Identity Providers`

Click on the `Add provider` drop down and select Github

![Click on the Add provider drop down and select Github](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hhzfhu7xmo6gr25avapi.png)

In the `Add identity provider` page copy the `Redirect URI`

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/c8ve0y9aqecjg4i2lgzr.png)

In Github go to `Settings`

![In Github go to Settings](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z8inxoz1x6lfu4igggg0.png)

In Setting go to `Developer Settings`

![Developer Settings](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xae004ttg72n85s1z0kq.png)

In `Developer Settings` select `OAuth Apps` 

Click the `New OAuth App` button

![New OAuth App button](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/op2celyrsoxv2bcw3r4y.png)

In the `Register a new OAuth application`

Add a `Application Name`

Add a `Homepage URL` (in this case I am running locally)

Add `Authorization callback URL` (we copied this earlier from keycloak i.e. Redirect URI)

Then click the `Register application` button

![Register new OAuth application](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q1zvd1ra9djzn9d8vcx5.png)

In the follow on page you can get the `Client ID` and `Generate a new Client secret` with the button

![get client id and secret](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3n6seoz2uvieoopyz91h.png)

Copy the Client ID and Client secret
Back in Keycloak `Add identity provider` page add the `Client ID` and `Client secret` and click the save button

![add client id and secret](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6y0esx38x4qc6ao8hrv4.png)

As you can see when a protected route is clicked we get redirected to keycloak and have an option for github

![Show github redirect](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/spqq6ismtuf2oejlahv3.gif)

One final refinement we don't want show our users two different ways to login, so we change the Keycloak object from

```js
var keycloak = new Keycloak({ store: memoryStore });
```

Add an idp hint to the Keycloak object as follows

```js
var keycloak = new Keycloak({ store: memoryStore, idpHint: 'github' });
```

And our login flow looks like this 

![Show github redirect without keycloak login screen ](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/46dg8oqoggxmrjrvmzvu.gif)

**NOTE**: As I am logged into Github and have an active session I am not redirected to the Github login I just have to authorize.


