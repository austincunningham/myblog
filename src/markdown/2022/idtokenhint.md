
# Keycloak 19.0.1 and Setting the id_token_hint 

description: id_token_hint and how to set it

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kd6paztfgofophghmtpy.png)


Created a blog some time ago setting up [keycloak express and OIDC client](https://austincunningham.ddns.net/2022/keycloakexpressoidcg) and it happily worked fine with keycloak-17.0.0 and still does. On keycloak-19.0.2 same code completely falls over. (Note self always set prerequisites on dependencies in blogs).

First issue I needed to enable Standard flow for the client in keycloak as I was seeing the following error in the logs
```bash
2022-09-16 11:56:37,512 WARN  [org.keycloak.events] (executor-thread-0) type=LOGIN_ERROR, realmId=78ae1441-0616-4745-b021-5ca93fc9f779, clientId=null, userId=null, ipAddress=127.0.0.1, error=invalid_code
2022-09-16 11:58:56,673 ERROR [org.keycloak.services] (executor-thread-3) KC-SERVICES0095: Client is not allowed to initiate browser login with given response_type. Standard flow is disabled for the client.
```

It's in the `Clients\Capability config` section

![screenshot of keycloak ui clients capability](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5ijtn3qf6xrr79eiadey.png)

Secondly I was using localhost for my uri's in keycloak and in my code base and keycloak-19 did not play well with it. Changed everything to 127.0.0.1 and most routes started working again. With the exception of logout. I was hitting the following issue. 


![keycloak logout id_token_hint error screenshot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ph8527vbtx9yef50c9j4.png)

The keycloak logs had a similar error with more details.

```bash
2022-09-16 13:00:28,208 WARN  [org.keycloak.events] (executor-thread-57) type=LOGOUT_ERROR, realmId=1bfc6eb7-ffa8-497f-96cc-69840b6c3f39, clientId=null, userId=null, ipAddress=127.0.0.1, error=invalid_request
2022-09-16 13:11:48,730 WARN  [org.keycloak.protocol.oidc.endpoints.LogoutEndpoint] (executor-thread-75) Either the parameter 'client_id' or the parameter 'id_token_hint' is required when 'post_logout_redirect_uri' is used.
```

So because I was using `post_logout_redirect_uri` I need to use either `client_id` or `id_token_hint` parameter. So I had three options 
- stop using `post_logout_rediret_uri` 
- add a `client_id` parameter to `post_logout_redirect_uri` 
- add a `id_token_hint` parameter to `post_logout_redirect_uri` 

## Stop using post_logout_redirect_uri
Remove it from the keycloakeIssuer.Client 
```js
const keycloakIssuer = await Issuer.discover("http://127.0.0.1:8080/realms/keycloak-express")
// I just comment out the line in the client 
const client = new keycloakIssuer.Client({
    client_id: 'keycloak-express',
    client_secret: 'long_secret-here',
    redirect_uris: ['http://127.0.0.1:3000/auth/callback'],
    //post_logout_redirect_uris: ['http://127.0.0.1:3000/logout/callback'],
    response_types: ['code'],
  });
```
Looks like this it prompts for a logout and leaves you at a keycloak logged out screen. 
![screen grab of logout without post_logout_redirect_uri ](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7ban9kgffjx05wv4oxxk.gif)

## Add client_id parameter
We have set the client_id in the `keycloakeIssuer.Client` so it just a matter of setting it in the logout as a parameter
```js
// start logout request
app.get('/logout', (req, res) => {
    res.redirect(client.endSessionUrl({
        client_id: "keycloak-express"
    }
    ));
});
```
Looks like this as you can see it ask for another confirmation before redirecting to the app.

![screen grab of logout with client_id parameter set](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dkhredgl17nmk8u3rpxo.gif)

## Add id_token_hint parameter
What is `id_token_hint` and how do I populate it?
Me I am terrible at reading/comprehending documentation and much prefer a good example. In this case I didn't find any examples. I found the following documentation referencing `id_token_hint`
- [OpenID Connect RP-Initiated Logout ](https://openid.net/specs/openid-connect-rpinitiated-1_0.html) which I found too abstract to formulate what to do to generating `id_token_hint` or find it.
- [the node-oidc-client](https://github.com/panva/node-openid-client/tree/main/docs#clientendsessionurlparameters) gave me a hint 

![Image of the node-oidc-client docs](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zqpdcyj45d10jrxdjj0n.png)

There is a tokenSet object that is created as part of the passportjs strategy login flow. I inspected this object and found that it has a `id_token` and I made this `id_token_hint = id_token` and my issue was solved. 

So I was using passwordjs and node-openid-client
```js
var TokenSet
passport.use('oidc', new Strategy({client}, (tokenSet, userinfo, done)=>{
        TokenSet = tokenSet;
        return done(null, tokenSet.claims());
    })
)
//And on logout we can set the id_token_hint parameter
app.get('/logout', (req, res) => {
    res.redirect(client.endSessionUrl({
        id_token_hint: TokenSet.id_token
    }
    ));
});
```
Looks like this and is a much better user experience

![screen grab of logout with id_token_hint parameter set](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/v6nk3g3bqslzeuv9vnhw.gif) 

Code lives [here](https://github.com/austincunningham/keycloak-express-openid-client/tree/keycloak-19)


