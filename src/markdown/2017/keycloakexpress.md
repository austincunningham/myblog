
# Keycloak and Express

This is a guide for setting up Express and Keycloak to protect web routes. Background Keycloak is an open source identity and access management solution that makes it easy to secure applications or microservices with little to no code. Express is a minimal and flexible Node.js web application framework. It can take a while to work your way through the official Keycloak documentation as the documentation is extensive and covers may different use cases .This a quick how to guide with minimum setup.

The goal is to create an Express app that uses Keycloak to protect the ‘/test ‘ route. The login and user setup are controlled by keycloak. The default route ‘/ ‘ is unprotected. The ‘/logout’ route kills the keycloak session.

To install keycloak-connect npm in your express application use the following command

```bash
npm install keycloak-connect --save
```

## Setup the Express server

You need to import keycloak-connect and express-sessions into your express application.

```js
const Keycloak = require('keycloak-connect');
const session = require('express-session');
```

Next configure the session to use memoryStore. Setup keycloak middleware to use the session memoryStore.

```js
var memoryStore = new session.MemoryStore();                       
var keycloak = new Keycloak({ store: memoryStore });
//session                       
app.use(session({
    secret:'BeALongSecret',                         
    resave: false,                         
    saveUninitialized: true,                         
    store: memoryStore                       
}));

app.use(keycloak.middleware());
```

You can then use keycloak.protect on your protected routes . This will check to see if a user is logged in on the keycloak server and redirect to the route. If a user is not logged in the server will redirect to the keycloak login page. User can create new accounts by clicking on the register link on the login page. This creates new users on the Keycloak server.

```js
//route protected with Keycloak 
app.get(‘/test’, keycloak.protect(), function(req, res){
    res.render(
        ‘test’, 
        {title:’Test of the test’}
        ); 
});
```

Set the logout route to use keycloak middleware to kill the session.

```js
app.use( keycloak.middleware( { logout: '/'} ));
```

See the following for the full implementation of server.

```js

'use strict';

const Keycloak = require('keycloak-connect');
const express = require('express');
const session = require('express-session');
const expressHbs = require('express-handlebars');

const app = express();


// Register 'handelbars' extension with The Mustache Express
app.engine('hbs', expressHbs({extname:'hbs',
  defaultLayout:'layout.hbs',
  relativeTo: __dirname}));
app.set('view engine', 'hbs');


var memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore });

//session
app.use(session({
  secret:'thisShouldBeLongAndSecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

app.use(keycloak.middleware());

//route protected with Keycloak
app.get('/test', keycloak.protect(), function(req, res){
  res.render('test', {title:'Test of the test'});
});

//unprotected route
app.get('/',function(req,res){
  res.render('index');
});

app.use( keycloak.middleware( { logout: '/'} ));

app.listen(8000, function () {
  console.log('Listening at http://localhost:8000');
});
```


## Installation of example
Clone this repo and cd to the new directory run npm install, there is some extra stuff like views in the repo.

## Demo Video
You can see Keycloak and an Express.js server in action at

[![ScreenShot](https://github.com/austincunningham/keycloak-express/blob/master/keycloak-setup.jpg?raw=true)](https://youtu.be/VAzI7f3pxec)

## Setup Keycloak Server
You will need to have a Keycloak server up and running to use this express application. Keycloak can be downloaded and run locally or can be run from a docker container see [docker hub image](https://hub.docker.com/r/jboss/keycloak/) for more info.

Download Keycloak at [the download page](http://www.keycloak.org/downloads.html) .To run it locally unzip the downloaded file and run standalone.sh

```bash
./keycloak-unzip-directory/bin/standalone.sh
```
You can then access the Keycloak server from a browser using the following url

http://localhost:8080/auth/
You will hit the initial password screen for Keycloak administrator .

![](https://cdn-images-1.medium.com/max/1600/1*TnDXQpqicsMOT-Bowo3ynw.png?style=centerme)

For more information on setting up Keycloak see the following [guide](https://www.keycloak.org/docs/latest/getting_started/index.html)

Next you need to [setup a Realm](http://www.keycloak.org/docs/latest/getting_started/index.html#creating-a-realm-and-user) . Login in to Keycloak Admin Console and hover over top left hand corner and click on Add realm and give it a name.

![](https://cdn-images-1.medium.com/max/2400/1*8QUACOFFtq3ou5QA_UmHqQ.png?style=centerme)
create a realm

To use the Node.js adapter, first you must create a client for your application in the Keycloak Administration Console. [Setup a Open ID Connect Client](http://www.keycloak.org/docs/latest/server_admin/index.html#_clients). In your new realm click on Clients and Create and give your client a name/ID.

![](https://cdn-images-1.medium.com/max/2400/1*lKPpdCLjYu6GHPfKn3MIFw.png?style=centerme)

The adapter supports public, confidential, and bearer-only access type. Which one to choose depends on the use-case scenario. In this case I picked public with openid-connect.

![](https://cdn-images-1.medium.com/max/2400/1*USxH7yuMSYuV6_E7zCXcKg.png?style=centerme)

You will need to define a valid redirect URL

![](https://cdn-images-1.medium.com/max/1600/1*EBvShEJuRoPae84DeqX7Yw.png?style=centerme)

Once the client is created click the Installation tab, select Keycloak OIDC JSON for Format Option, and then click Download.

![](https://cdn-images-1.medium.com/max/2400/1*QnixBP-B0-I0nnsQQeo71A.png?style=centerme)

The downloaded keycloak.json file should be placed at the root folder of your project. Sample keycloak.json file

```json
{
  "realm": "test",
  "auth-server-url": "http://localhost:8080/auth",
  "ssl-required": "external",
  "resource": "keycloak-express", 
  "public-client": true,
  "confidential-port": 0
}
```
That’s it you will have your Express web routes protected by Keycloak .For more information see [here](http://www.keycloak.org/docs/latest/securing_apps/index.html#_nodejs_adapter).