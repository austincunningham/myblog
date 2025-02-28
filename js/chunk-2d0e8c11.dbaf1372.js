(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0e8c11"],{"8b2c":function(e,t,s){"use strict";s.r(t);var n=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},a=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("section",[s("h1",[e._v("Openshift and Node")]),s("p",[s("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1600/1*woBJO0R_xYjmcp96AkZJYA.png?style=centerme",alt:""}})]),s("p",[e._v("This is a guide for setting up a Node application on Openshift 3.6. Background information Openshift is an platform for deploying and hosting applications. This is mainly a learning experience for me so I will point out my pain points.")]),s("h2",[e._v("Setting up Openshift")]),s("p",[e._v("I used Linux Mint as an OS. First I installed docker because it is a dependency")]),s("p",[s("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1600/0*OFD22NxBNgDoqMET.png?style=centerme",alt:""}})]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[e._v("sudo apt install docker.io\n")])]),s("blockquote",[s("p",[s("strong",[e._v("NOTE")]),e._v(": to configure docker to run with out sudo see this "),s("a",{attrs:{href:"https://docs.docker.com/engine/installation/linux/linux-postinstall/"}},[e._v("blog")]),e._v(".")])]),s("p",[e._v("Setup Docker daemon with an insecure registry parameter of 172.30.0.0/16 Add or edit the /etc/docker/daemon.json file and add the following:")]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-json"}},[e._v("{\n   "),s("span",{pre:!0,attrs:{class:"hljs-attr"}},[e._v('"insecure-registries"')]),e._v(": [\n     "),s("span",{pre:!0,attrs:{class:"hljs-string"}},[e._v('"172.30.0.0/16"')]),e._v("\n   ]\n}\n")])]),s("blockquote",[s("p",[s("strong",[e._v("NOTE")]),e._v(": daemon.json file didn’t exist so created it, We add this because Openshift’s registry is using a self signed cert and we are allowing our local docker config to trust it.")])]),s("p",[e._v("Restart the Docker service")]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[e._v("sudo service docker restart\n")])]),s("p",[e._v("Download the oc binary at "),s("a",{attrs:{href:"https://www.openshift.org/download.html#oc-platforms"}},[e._v("here")]),e._v(" . Run oc cluster up to start Openshift.")]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[e._v("oc cluster up\n")])]),s("p",[s("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1600/1*uOGNt8GV5ffwSKG4D7RvCA.png?style=centerme",alt:""}})]),s("blockquote",[s("p",[s("strong",[e._v("NOTE")]),e._v(": if docker not configured to run without sudo then oc will also need sudo to run, haven’t documented exporting paths")])]),s("p",[e._v("You can now log into the web portal")]),s("p",[s("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1600/1*23OW749xYm0rorSmC2sD-g.png?style=centerme",alt:""}})]),s("p",[e._v("Once logged in you will see the console")]),s("p",[s("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1600/1*U9Fg2cXMXnSA0Nk7Y2vaMQ.png?style=centerme",alt:""}})]),s("h2",[e._v("Deploying a Node application")]),s("p",[e._v("Click on create project")]),s("p",[s("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1600/1*7vTEn8NMPY2XFAYbNwarZQ.png?style=centerme",alt:""}})]),s("p",[e._v("Add a Name and click Create")]),s("p",[s("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1600/1*CG9zyYOh9tn5nglcJKxCbQ.png?style=centerme",alt:""}})]),s("p",[e._v("Select JavaScript")]),s("p",[s("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1600/1*sU5kBtmhjt_tsfS6el-PbA.png?style=centerme",alt:""}})]),s("p",[e._v("I selected Node.js 6.")]),s("p",[s("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1600/1*a1JFLrcckEPOxGsz99tn5g.png?style=centerme",alt:""}})]),s("p",[e._v("Add a "),s("strong",[e._v("Name")]),e._v(" and add the "),s("strong",[e._v("Git Repository URL")]),e._v(" of your Node.js application")]),s("blockquote",[s("p",[s("strong",[e._v("NOTE")]),e._v(": https version of git URL")])]),s("p",[s("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1600/1*L9kDx_vzp2d42Il9GZ0z8w.png?style=centerme",alt:""}})]),s("p",[e._v("Your application is now deployed select "),s("strong",[e._v("Continue to overview")]),e._v(" to proceed to the Openshift console you can see the URL for accessing your application on the right. If there are any issues click on the pod icon, you can access the logs from a tab.")]),s("p",[s("img",{attrs:{src:"https://cdn-images-1.medium.com/max/1600/1*1HOen2lI9U5WkV5kjQ6Akg.png?style=centerme",alt:""}})]),s("p",[e._v("Pain point if your application doesn’t have an npm start script you application won’t build . You need to add a start script to your package.json like")]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-json"}},[e._v("“scripts”: {\n            “start”: “node app.js”\n           }\n")])]),s("p",[e._v("Pain point your Node.js application needs to be using the same port as Openshift or your application won’t render.")]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-js"}},[e._v("app.listen("),s("span",{pre:!0,attrs:{class:"hljs-number"}},[e._v("8080")]),e._v(", "),s("span",{pre:!0,attrs:{class:"hljs-function"}},[s("span",{pre:!0,attrs:{class:"hljs-keyword"}},[e._v("function")]),e._v(" ("),s("span",{pre:!0,attrs:{class:"hljs-params"}}),e._v(") ")]),e._v("{ \n    "),s("span",{pre:!0,attrs:{class:"hljs-built_in"}},[e._v("console")]),e._v(".log(‘Listening at http:"),s("span",{pre:!0,attrs:{class:"hljs-comment"}},[e._v("//localhost:8080’); ")]),e._v("\n    });\n")])]),s("blockquote",[s("p",[s("strong",[e._v("NOTE")]),e._v(": if you don’t want to change your application port, you can change both the "),s("strong",[e._v("route")]),e._v(" and the "),s("strong",[e._v("service")]),e._v(" in Openshift by editing there yml files in the gui or by using the oc edit command e.g.")])]),s("pre",{pre:!0},[s("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[e._v("oc edit route <route-name> \noc edit service <service-name>\n")])]),s("p",[e._v("And that all you should be up an running.")])])}],o=s("2877"),r={},i=Object(o["a"])(r,n,a,!1,null,null,null);t["default"]=i.exports}}]);
//# sourceMappingURL=chunk-2d0e8c11.dbaf1372.js.map