(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d210a5a"],{b97d:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},o=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("section",[a("h1",[e._v("Setting up Keycloak using Github Identity provider in Express")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fwj1s9zqokkmdu16rxek.png",alt:"banner image"}})]),a("p",[e._v("First what is meant by by Identity provider? it's allowing a third party to handle your authentication to your application like Facebook, Github or Linkedin see keycloaks supported list below in image.")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s12p4md845hs83y7azaa.png",alt:"Alt Text"}})]),a("p",[e._v("Setting up idp is well documented "),a("a",{attrs:{href:"https://www.keycloak.org/docs/latest/server_admin/#social-identity-providers"}},[e._v("here")]),e._v(".")]),a("p",[e._v("In this example I will use Github. I have a previous blog detailing how to setup an "),a("a",{attrs:{href:"https://austincunningham.ddns.net/2017/keycloakexpress"}},[e._v("Express app with Keycloak")]),e._v(". This basically covers setting up a keycloak realm , client,  user, and adding the keycloak.json to your express app and using the "),a("a",{attrs:{href:"https://www.npmjs.com/package/keycloak-connect"}},[e._v("keycloak-connect module")]),e._v(".")]),a("p",[e._v("Once you have your app setup with Keycloak you can add an identity provider.")]),a("p",[e._v("In Keycloak select "),a("code",{pre:!0},[e._v("Identity Providers")])]),a("p",[e._v("Click on the "),a("code",{pre:!0},[e._v("Add provider")]),e._v(" drop down and select Github")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hhzfhu7xmo6gr25avapi.png",alt:"Click on the Add provider drop down and select Github"}})]),a("p",[e._v("In the "),a("code",{pre:!0},[e._v("Add identity provider")]),e._v(" page copy the "),a("code",{pre:!0},[e._v("Redirect URI")])]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/c8ve0y9aqecjg4i2lgzr.png",alt:"Alt Text"}})]),a("p",[e._v("In Github go to "),a("code",{pre:!0},[e._v("Settings")])]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/z8inxoz1x6lfu4igggg0.png",alt:"In Github go to Settings"}})]),a("p",[e._v("In Setting go to "),a("code",{pre:!0},[e._v("Developer Settings")])]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xae004ttg72n85s1z0kq.png",alt:"Developer Settings"}})]),a("p",[e._v("In "),a("code",{pre:!0},[e._v("Developer Settings")]),e._v(" select "),a("code",{pre:!0},[e._v("OAuth Apps")])]),a("p",[e._v("Click the "),a("code",{pre:!0},[e._v("New OAuth App")]),e._v(" button")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/op2celyrsoxv2bcw3r4y.png",alt:"New OAuth App button"}})]),a("p",[e._v("In the "),a("code",{pre:!0},[e._v("Register a new OAuth application")])]),a("p",[e._v("Add a "),a("code",{pre:!0},[e._v("Application Name")])]),a("p",[e._v("Add a "),a("code",{pre:!0},[e._v("Homepage URL")]),e._v(" (in this case I am running locally)")]),a("p",[e._v("Add "),a("code",{pre:!0},[e._v("Authorization callback URL")]),e._v(" (we copied this earlier from keycloak i.e. Redirect URI)")]),a("p",[e._v("Then click the "),a("code",{pre:!0},[e._v("Register application")]),e._v(" button")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/q1zvd1ra9djzn9d8vcx5.png",alt:"Register new OAuth application"}})]),a("p",[e._v("In the follow on page you can get the "),a("code",{pre:!0},[e._v("Client ID")]),e._v(" and "),a("code",{pre:!0},[e._v("Generate a new Client secret")]),e._v(" with the button")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3n6seoz2uvieoopyz91h.png",alt:"get client id and secret"}})]),a("p",[e._v("Copy the Client ID and Client secret\nBack in Keycloak "),a("code",{pre:!0},[e._v("Add identity provider")]),e._v(" page add the "),a("code",{pre:!0},[e._v("Client ID")]),e._v(" and "),a("code",{pre:!0},[e._v("Client secret")]),e._v(" and click the save button")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6y0esx38x4qc6ao8hrv4.png",alt:"add client id and secret"}})]),a("p",[e._v("As you can see when a protected route is clicked we get redirected to keycloak and have an option for github")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/spqq6ismtuf2oejlahv3.gif",alt:"Show github redirect"}})]),a("p",[e._v("One final refinement we don't want show our users two different ways to login, so we change the Keycloak object from")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-js"}},[a("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("var")]),e._v(" keycloak = "),a("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("new")]),e._v(" Keycloak({ "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[e._v("store")]),e._v(": memoryStore });\n")])]),a("p",[e._v("Add an idp hint to the Keycloak object as follows")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-js"}},[a("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("var")]),e._v(" keycloak = "),a("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("new")]),e._v(" Keycloak({ "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[e._v("store")]),e._v(": memoryStore, "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[e._v("idpHint")]),e._v(": "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v("'github'")]),e._v(" });\n")])]),a("p",[e._v("And our login flow looks like this")]),a("p",[a("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/uploads/articles/46dg8oqoggxmrjrvmzvu.gif",alt:"Show github redirect without keycloak login screen "}})]),a("p",[a("strong",[e._v("NOTE")]),e._v(": As I am logged into Github and have an active session I am not redirected to the Github login I just have to authorize.")])])}],r=a("2877"),p={},n=Object(r["a"])(p,s,o,!1,null,null,null);t["default"]=n.exports}}]);
//# sourceMappingURL=chunk-2d210a5a.2b0070fa.js.map