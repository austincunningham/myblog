(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0d7331"],{7695:function(e,s,t){"use strict";t.r(s);var a=function(){var e=this,s=e.$createElement;e._self._c;return e._m(0)},n=[function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("section",[t("h1",[e._v("Ionic and the Aerogear Mobile Developer Console on Openshift")]),t("p",[t("strong",[e._v("Note")]),e._v(": I have tested against the latest release and some of these instructions no longer work as expected, As the MDC is in development will revise article in the future.")]),t("p",[e._v("I wanted to develop an Ionic mobile application and use the services provide by the Aerogear MDC on Openshift. The getting started guides")]),t("blockquote",[t("p",[t("a",{attrs:{href:"https://ionicframework.com/getting-started#cli"}},[e._v("Ionic")])])]),t("blockquote",[t("p",[t("a",{attrs:{href:"https://www.okd.io/minishift/"}},[e._v("Openshift(Minishift)")])])]),t("blockquote",[t("p",[t("a",{attrs:{href:"https://docs.aerogear.org/aerogear/latest/getting-started.html"}},[e._v("Aerogear Mobile Developer Console")])])]),t("h2",[e._v("Setting up the Aerogear Mobile Developer Console")]),t("p",[e._v("I won’t go into setting up Minishift, for the Aerogear Mobile Developer console you clone the repo for the MDC checkout the release tag and run the setup script")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[e._v("git "),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("clone")]),e._v(" https://github.com/aerogear/mobile-developer-console.git\n"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("cd")]),e._v(" mobile-developer-console\ngit checkout 1.0.0\n./scripts/minishift.sh\n")])]),t("p",[t("strong",[e._v("Note")]),e._v(": The script destroys the default "),t("a",{attrs:{href:"https://docs.okd.io/latest/minishift/using/profiles.html"}},[e._v("Minishift profile")]),e._v(" and creates a new one")]),t("p",[e._v("Once finished you should get the following the mobile tab in your service catalog on Openshift.")]),t("p",[t("img",{attrs:{src:"https://cdn-images-1.medium.com/max/800/1*nKS69-5ve95zKg7VR2F4ow.png?style=centerme",alt:""}})]),t("p",[e._v("Next you click on the MDC icon and follow the steps to complete installation, select a project to add the MDC to and don’t bind at this time.")]),t("p",[t("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1200/1*qO5gWmxvWjCKmMRmOy6cIA.gif?style=centerme",alt:""}})]),t("p",[e._v("When finished you will be able to access the MDC from the project you deployed it too.")]),t("h2",[e._v("Create a mobile app backend in the Mobile Developer Console")]),t("p",[t("img",{attrs:{src:"https://cdn-images-1.medium.com/max/800/1*i5bVnbRphc8RVH_z2EYB4A.gif?style=centerme",alt:""}})]),t("h2",[e._v("Add the Identity Management Service")]),t("p",[e._v("Add Identity Management service to the app mobile app. This creates a Keycloak instance and a Postgres server, it does a lot of setup for you like creating realms and setting up the admin user and password.")]),t("p",[t("strong",[e._v("NOTE")]),e._v(": change you admin password at this point")]),t("p",[t("img",{attrs:{src:"https://cdn-images-1.medium.com/max/800/1*Y096A8DsHyyx6u8FsI3oBQ.gif?style=centerme",alt:""}})]),t("p",[e._v("Once Keycloak and Postgres have been deployed you need to bind the identity management service to your mobile back-end.")]),t("p",[t("img",{attrs:{src:"https://cdn-images-1.medium.com/max/800/1*Ut20OhUmYQ4K81m1WdOQRw.gif?style=centerme",alt:""}})]),t("h2",[e._v("Creating an Ionic App and using the Identity Management Service")]),t("p",[e._v("Before starting with the ionic app you need to configure the Keycloak instance this is documented "),t("a",{attrs:{href:"https://docs.aerogear.org/aerogear/latest/identity-management.html#configuring-Identity%20Management"}},[e._v("here")]),e._v(" . Just set the "),t("strong",[e._v("Valid Redirect URIs")]),e._v(" and the "),t("strong",[e._v("Web Origins")]),e._v(" to point at the Cordova tabs URL.")]),t("p",[e._v("On to configuring the ionic app I will use one of the template apps from the ionic getting started guide")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[e._v("ionic start "),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("test")]),e._v("-ionic tabs\n"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("cd")]),e._v(" "),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("test")]),e._v("-ionic\n")])]),t("p",[e._v("Create new file in the ./src directory of your ionic project called "),t("strong",[e._v("mobile-services.json")])]),t("p",[e._v("Copy the contents mobile-services.json from the Mobile Developer Console, your app’s Configuration tab to this new file.")]),t("p",[t("strong",[e._v("NOTE")]),e._v(": Minishift url’s are not public so our auth url don’t work outside of localhost.")]),t("p",[t("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1200/1*Wbox4_jYlxT1zk4RsPaT0Q.png?style=centerme",alt:""}})]),t("p",[e._v("Install the following npm packages in your ionic project")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[e._v("npm install @aerogear/app --save\nnpm install @aerogear/auth --save\nnpm install @types/node --save-dev\n")])]),t("p",[t("strong",[e._v("NOTE")]),e._v(": I only tested with "),t("em",[e._v("@aerogear/app 2.3.1")]),e._v("\nEdit "),t("strong",[e._v("./src/tsconfig.app.json")]),e._v(" and add a types “node”, This was a bit of a pain point as you can’t use "),t("strong",[e._v("require")]),e._v(" without doing this")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-json"}},[e._v("{\n  "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[e._v('"extends"')]),e._v(": "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('"../tsconfig.json"')]),e._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[e._v('"compilerOptions"')]),e._v(": {\n  "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[e._v('"outDir"')]),e._v(": "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('"../out-tsc/app"')]),e._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[e._v('"types"')]),e._v(": ["),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('"node"')]),e._v("]\n},\n  "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[e._v('"exclude"')]),e._v(": [\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('"test.ts"')]),e._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('"**/*.spec.ts"')]),e._v("\n  ]\n}\n")])]),t("p",[e._v("Add the following section to the ./src/main.ts file")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-js"}},[t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("import")]),e._v(" { enableProdMode } "),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("from")]),e._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v("'@angular/core'")]),e._v(";\n"),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("import")]),e._v(" { platformBrowserDynamic } "),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("from")]),e._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v("'@angular/platform-browser-dynamic'")]),e._v(";\n\n"),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("import")]),e._v(" { AppModule } "),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("from")]),e._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v("'./app/app.module'")]),e._v(";\n"),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("import")]),e._v(" { environment } "),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("from")]),e._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v("'./environments/environment'")]),e._v(";\n\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("//==========================add the following lines of code=====================")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("import")]),e._v(" { init } "),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("from")]),e._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('"@aerogear/app"')]),e._v(";\n"),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("import")]),e._v(" { Auth } "),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("from")]),e._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('"@aerogear/auth"')]),e._v(";\n\n"),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("const")]),e._v(" appConfig = "),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("require")]),e._v("("),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('"./mobile-services.json"')]),e._v(");\n"),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("const")]),e._v(" app = init(appConfig);\n\n"),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("const")]),e._v(" authService = "),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("new")]),e._v(" Auth(app.config);\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v('//let initOptions = { onLoad: "login-required" };')]),e._v("\n\nauthService.init({ "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[e._v("onLoad")]),e._v(": "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('"login-required"')]),e._v(" })\n.then("),t("span",{pre:!0,attrs:{class:"hljs-function"}},[t("span",{pre:!0,attrs:{class:"hljs-params"}},[e._v("()")]),e._v(" =>")]),e._v(" {\n    "),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("// successful init & authentication")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("console")]),e._v(".log("),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v("'keycloak init'")]),e._v(");\n})\n.catch("),t("span",{pre:!0,attrs:{class:"hljs-function"}},[e._v("("),t("span",{pre:!0,attrs:{class:"hljs-params"}},[e._v("err")]),e._v(") =>")]),e._v(" {\n    "),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("// initialization error")]),e._v("\n    "),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("console")]),e._v(".log("),t("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v("'keycloak init failure'")]),e._v(", err);\n});\n\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("//========================end of code block======================================")]),e._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("if")]),e._v(" (environment.production) {\n  enableProdMode();\n}\n\nplatformBrowserDynamic().bootstrapModule(AppModule)\n  .catch("),t("span",{pre:!0,attrs:{class:"hljs-function"}},[t("span",{pre:!0,attrs:{class:"hljs-params"}},[e._v("err")]),e._v(" =>")]),e._v(" "),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("console")]),e._v(".log(err));\n")])]),t("p",[e._v("That it we have now got our application protected by the Identity Management service test by running the ionic app from the root of the project")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[e._v("ionic serve\n")])]),t("p",[t("img",{attrs:{src:"https://cdn-images-1.medium.com/max/800/1*Gn64vq8aoK2SqgymyUdstg.gif?style=centerme",alt:""}})]),t("p",[e._v("I am using a user I setup on the Keycloak admin console to sign in.")])])}],r=t("2877"),o={},i=Object(r["a"])(o,a,n,!1,null,null,null);s["default"]=i.exports}}]);
//# sourceMappingURL=chunk-2d0d7331.7a90c0c9.js.map