
# Keycloak Express Openid-client

![banner](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kd6paztfgofophghmtpy.png)

Keycloak is [deprecating](https://www.keycloak.org/2022/02/adapter-deprecation) their client adapters (keycloak-connect) for Node and recommending openid-client as a replacement.

## Setup Keycloak
First I [download keycloak](https://www.keycloak.org/downloads) extract it and you can run it with the following command
```bash
bin/kc.sh start-dev
```
You can then login http://localhost:8080, first time you do keycloak asks you to set an admin user and password. 

Create a Realm and give it an name and create it. I am using keycloak-express for my realm name

![Create realm](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/e0erj948wmmrbng0v14l.gif)

The create a Client using openid-connect in the Realm

![Create a client](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/wctbp51o639k3hgu16q0.gif)

Set the Valid Redirect URIs and select save. 

![set valid redirect URIs](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/07crr8q4tmtovxodehgq.gif)

**NOTE**:you can specify specific routes here but I am using a wild card(not recommend best practice)

Create a user its documented [here](https://www.keycloak.org/docs/latest/server_admin/index.html#proc-creating-user_server_administration_guide) so I won't go into it.

That's it for Keycloak setup 

## Setup Openid-client with Passport in Express

We are going to use this [openid-client](https://www.npmjs.com/package/openid-client) and [passport](https://www.npmjs.com/package/passport) to connect to keycloak. I install the following
```bash
npm install passport
npm install openid-client
npm install express-session
npm install express
```

From the Realm we need the openid-configuration can be got from an endpoint 
```
/realms/{realm-name}/.well-known/openid-configuration
```
So in my case the realm name is keycloak-express so the url will be http://localhost:8080/realms/keycloak-express/.well-known/openid-configuration the output is as follows

![.well-known url output](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ruaxgvsvycdhubwhm7b1.png)

All we need is this `issuer:"http://localhost:8080/realms/keycloak-express"` url to connect openid-client to keycloak as follows

```js
'use strict';

import express from 'express';
import { Issuer, Strategy } from 'openid-client';
import passport from 'passport';
import expressSession from 'express-session';

const app = express();

// use the issuer url here
const keycloakIssuer = await Issuer.discover('http://localhost:8080/realms/keycloak-express')
// don't think I should be console.logging this but its only a demo app
// nothing bad ever happens from following the docs :)
console.log('Discovered issuer %s %O', keycloakIssuer.issuer, keycloakIssuer.metadata);

// client_id and client_secret can be what ever you want
// may be worth setting them up as env vars 
const client = new keycloakIssuer.Client({
    client_id: 'keycloak-express',
    client_secret: 'long_secret-here',
    redirect_uris: ['http://localhost:3000/auth/callback'],
    post_logout_redirect_uris: ['http://localhost:3000/logout/callback'],
    response_types: ['code'],
  });
```

I then setup express sessions
```js
var memoryStore = new expressSession.MemoryStore();
app.use(
    expressSession({
    secret: 'another_long_secret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
    })
);
```

Then setup passport to use open connect id strategy 
```js
app.use(passport.initialize());
app.use(passport.authenticate('session'));

// this creates the strategy
passport.use('oidc', new Strategy({client}, (tokenSet, userinfo, done)=>{
        return done(null, tokenSet.claims());
    })
)

passport.serializeUser(function(user, done) {
    done(null, user);
  });
passport.deserializeUser(function(user, done) {
    done(null, user);
});
```
Most of above is copied from the passport docs, I found [this blog](https://medium.com/@prashantramnyc/node-js-with-passport-authentication-simplified-76ca65ee91e5) helpful in explaining serialize/deserialize.

Next I setup the authentication route this makes use of the the callback `redirect_uris:` from the `keycloakIssuer.Client`

```js
// default protected route /test
app.get('/test', (req, res, next) => {
    passport.authenticate('oidc')(req, res, next);
});

// callback always routes to test 
app.get('/auth/callback', (req, res, next) => {
    passport.authenticate('oidc', {
      successRedirect: '/testauth',
      failureRedirect: '/'
    })(req, res, next);
});
```

I then setup a function to check if a route is authenticated
```js
// function to check weather user is authenticated, req.isAuthenticated is populated by password.js
// use this function to protect all routes
var checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { 
        return next() 
    }
    res.redirect("/test")
}
```

This can then be used on protected routes
```js
app.get('/testauth', checkAuthenticated, (req, res) => {
    res.render('test');
});

app.get('/other', checkAuthenticated, (req, res) => {
    res.render('other');
});

//unprotected route
app.get('/',function(req,res){
    res.render('index');
});
```

Finally I set the logout route up this also uses a callback `post_logout_redirect_uris` from the `keycloakIssuer.Client`

```js
// start logout request
app.get('/logout', (req, res) => {
    res.redirect(client.endSessionUrl());
});

// logout callback
app.get('/logout/callback', (req, res) => {
    // clears the persisted user from the local storage
    req.logout();
    // redirects the user to a public route
    res.redirect('/');
});
```

And set the app to listen
```js
app.listen(3000, function () {
  console.log('Listening at http://localhost:3000');
});
```

Repo [here](https://github.com/austincunningham/keycloak-express-openid-client) with some extra code around views. Looks like this

![login flow](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/auslqsikfxvsfvkp1lz4.gif)











