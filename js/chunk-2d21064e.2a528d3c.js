(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d21064e"],{b868:function(s,n,t){"use strict";t.r(n);var e=function(){var s=this,n=s.$createElement;s._self._c;return s._m(0)},a=[function(){var s=this,n=s.$createElement,t=s._self._c||n;return t("section",[t("h1",[s._v("Switching between binaries")]),t("p",[t("img",{attrs:{src:"https://cdn-images-1.medium.com/max/800/1*TYr9ZaIGbFeWjARZCqWm7A.png?style=centerme",alt:""}})]),t("p",[s._v("I am constantly changing my binaries for installation prerequisites and testing. I used to spend a bit of time change paths or updating "),t("strong",[s._v(".bashrc")]),s._v(" . This is a quick example of a bit of bash I used to reduce the manual steps involve around changing the oc binary(Openshift command line binary). Currently I have four versions of the oc binary on my PC 3.7, 3.9, 3.10 and 3.11, I put each binary in its own directory in "),t("strong",[s._v("/opt/openshift")])]),t("p",[t("img",{attrs:{src:"https://cdn-images-1.medium.com/max/800/1*zXG7mgEcd2CCmpWXBu6GOg.png?style=centerme",alt:""}})]),t("p",[s._v("I have the oc binary "),t("a",{attrs:{href:"https://www.shellhacks.com/symlink-create-symbolic-link-linux/"}},[s._v("sym-linked")]),s._v(" at "),t("strong",[s._v("/usr/local/bin/oc")]),s._v(" so I only need to change where the sym-link is pointing. This script checks the current version that is sym-linked , list the versions present on the PC , asks you what version you wish to install and removes the existing sym-link and adds an new one.")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[t("span",{pre:!0,attrs:{class:"hljs-meta"}},[s._v("#!/bin/bash")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"########################################################################################"')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v(" Current version of oc\nls -la /usr/"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("local")]),s._v("/bin/oc\n"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"########################################################################################"')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v(" Versions of openshift oc on the system\nls /opt/openshift\n"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"########################################################################################"')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"What version do you wish to install ?"')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("read")]),s._v(" version\nsudo rm /usr/"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("local")]),s._v("/bin/oc\nsudo ln -s /opt/openshift/"),t("span",{pre:!0,attrs:{class:"hljs-variable"}},[s._v("$version")]),s._v("/oc /usr/"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("local")]),s._v("/bin/oc\n"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('" "')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"########################################################################################"')]),s._v("\noc version\n"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('" "')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-built_in"}},[s._v("echo")]),s._v(" "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"########################################################################################"')]),s._v("\n")])]),t("p",[s._v("Once you have your script written you can make it executable by changing the Linux permissions")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("chmod u+x change_oc.sh\n")])]),t("p",[s._v("It can then be run")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("./change_oc.sh\n")])]),t("p",[s._v("Running it looks like this")]),t("p",[t("img",{attrs:{src:"https://cdn-images-1.medium.com/max/800/1*jC7XC2re8v9JXIqRvtn_Lw.gif?style=centerme",alt:""}})])])}],r=t("2877"),i={},l=Object(r["a"])(i,e,a,!1,null,null,null);n["default"]=l.exports}}]);
//# sourceMappingURL=chunk-2d21064e.2a528d3c.js.map