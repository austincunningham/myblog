(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0e9ae6"],{"8f24":function(s,a,t){"use strict";t.r(a);var n=function(){var s=this,a=s.$createElement;s._self._c;return s._m(0)},e=[function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("section",[t("h1",[s._v("JQ what I learned today")]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/i/nntejen2pmrcn1iu1r0k.png",alt:""}})]),t("h2",[s._v("What's jq ?")]),t("p",[s._v("A command line parser for json that can be downloaded "),t("a",{attrs:{href:"https://stedolan.github.io/jq/download/"}},[s._v("here")]),s._v(" or you can use the "),t("a",{attrs:{href:"https://jqplay.org/"}},[s._v("playground")]),s._v(". I will use this local json file as an beginner example hello-world.json")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-json"}},[s._v("{\n  "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v('"hello"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"world"')]),s._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v('"Water"')]),s._v(":{\n    "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v('"Atlantic"')]),s._v(":"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ocean"')]),s._v(",\n    "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v('"Pacific"')]),s._v(":"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ocean"')]),s._v(",\n    "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v('"Mediterranean"')]),s._v(":{\n      "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v('"Ocean"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("false")]),s._v(",\n      "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v('"Sea"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("true")]),s._v("\n    }\n  },\n  "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v('"Land"')]),s._v(":{\n    "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v('"Europe"')]),s._v(":[\n      "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ireland"')]),s._v(",\n      "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"France"')]),s._v(",\n      "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Germany"')]),s._v("\n    ],\n    "),t("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v('"Asia"')]),s._v(":[\n      "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"India"')]),s._v(",\n      "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"China"')]),s._v("\n    ]\n  }\n}\n")])]),t("h2",[s._v("Using jq")]),t("p",[s._v("Simplest use case is to render the whole json file and pretty print it")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# You can pass filters and json files as arguments")]),s._v("\njq "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'.'")]),s._v(" hello-world.json\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# You can cat the file and pipe it to jq")]),s._v("\ncat hello-world.json | jq\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# You can curl remote json and pipe it to jq e.g. from https://stedolan.github.io/jq/tutorial/")]),s._v("\ncurl "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'https://api.github.com/repos/stedolan/jq/commits?per_page=5'")]),s._v(" | jq "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'.'")]),s._v("\n")])]),t("p",[t("img",{attrs:{src:"https://dev-to-uploads.s3.amazonaws.com/i/uavyatp5vhw1f08q0cfa.png",alt:"Alt Text"}})]),t("h2",[s._v("Filtering with jq")]),t("p",[s._v("The "),t("a",{attrs:{href:"https://stedolan.github.io/jq/manual/"}},[s._v("manual")]),s._v(" is full of options for filtering and can be a lot to take in. We have seen already the most basic filter "),t("strong",[s._v("'.'")]),s._v(" which can be used with either method of invoking jq to return all data in the json.")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# We can filter to specific keys")]),s._v("\n$ jq "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'.hello'")]),s._v(" hello-world.json                                               \n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"world"')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("#  you can create a new object and create a new json files")]),s._v("\n$ cat hello-world.json | jq .Water > water.json\n{\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Atlantic"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ocean"')]),s._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Pacific"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ocean"')]),s._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Mediterranean"')]),s._v(": {\n    "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ocean"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("false")]),s._v(",\n    "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Sea"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("true")]),s._v("\n  }\n}\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# We can drill down")]),s._v("\n$ cat hello-world.json | jq .Water.Atlantic\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ocean"')]),s._v("\n$ cat hello-world.json | jq .Water.Mediterranean\n{\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ocean"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("false")]),s._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Sea"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("true")]),s._v("\n}\n$ cat hello-world.json | jq .Water.Mediterranean.Ocean\n"),t("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("false")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# arrays syntax is a little different")]),s._v("\n$ cat hello-world.json | jq "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'.Land.Europe[]'")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ireland"')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"France"')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Germany"')]),s._v("\n$ cat hello-world.json | jq "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'.Land.Europe'")]),s._v("  \n[\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ireland"')]),s._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"France"')]),s._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Germany"')]),s._v("\n]\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# Arrays can be accessed by indexes or splits [0:2]")]),s._v("\n$ cat hello-world.json | jq "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'.Land.Europe[0]'")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ireland"')]),s._v("\n$ cat hello-world.json| jq "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'.Land.Europe[0:2]'")]),s._v("\n[\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ireland"')]),s._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"France"')]),s._v("\n]\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# array symbol can be used to iterate over values")]),s._v("\n$ cat hello-world.json | jq "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'.Land[]\n'")]),s._v("\n[\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ireland"')]),s._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"France"')]),s._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Germany"')]),s._v("\n]\n[\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"India"')]),s._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"China"')]),s._v("\n]\n$ cat hello-world.json | jq "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'.Water[]'")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ocean"')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ocean"')]),s._v("\n{\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ocean"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("false")]),s._v(",\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Sea"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("true")]),s._v("\n}\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# Lots of other array slicing methods available in the manual this is only scratching the surface")]),s._v("\n")])]),t("p",[s._v("You can pipe multiple filters together and reassign values to create new json")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("$ cat hello-world.json | jq "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("'.Land | .Europe | {EU:[{country:.[]}]}'")]),s._v("\n{\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"EU"')]),s._v(": [\n    {\n      "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"country"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Ireland"')]),s._v("\n    },\n    {\n      "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"country"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"France"')]),s._v("\n    },\n    {\n      "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"country"')]),s._v(": "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Germany"')]),s._v("\n    }\n  ]\n}\n\n")])]),t("h1",[s._v("Using jq files to do more advance stuff")]),t("p",[s._v("You can use jq files as filters with the -f flag to create more complex filters with supporting functions. The file "),t("a",{attrs:{href:"https://gist.github.com/austincunningham/eca562b35651b9a6dd214d0023c19cdf"}},[s._v("Node-metrics.json")]),s._v(" has some cpu and memory usages stats from a Kubernetes Openshift cluster. I am looking to generate a report from this json.")]),t("p",[s._v("I created the following file "),t("em",[s._v("filterGenerateCsv.jq")]),s._v(" to filter the data in the json and creates an csv.")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# function definition filter the data")]),s._v("\ndef getNodeMetrics:\n    [.items[]|\n    {\n        name:.metadata.name,\n        cpu:.usage.cpu, \n        memory:.usage.memory\n    }\n    ];\n\n\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# use geNodeUsages to generate csv")]),s._v("\n.[] |\ngetNodeMetrics |\ngroup_by(.name) |\nmap({\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Node Name"')]),s._v(": .[].name ,\n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"CPU Node - Real"')]),s._v(": [.[].cpu] | add, \n  "),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"Memory Node - Real"')]),s._v(": [.[].memory] | add\n})| (.[0] | to_entries | map(.key)), (.[] | [.[]]) | @csv\n\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("#  (.[0] | to_entries | map(.key)) this filter sets the first array as follows")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# [")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v('#  "Node Name",')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v('#  "CPU Node - Real",')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v('#  "Memory Node - Real"')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# ]")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# (.[] | [.[]]) filter generates the arrays of values and @csv pipes to csv format")]),s._v("\n")])]),t("p",[s._v("I can then call the jq file as my filter argument with the -f flag")]),t("pre",{pre:!0},[t("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[t("span",{pre:!0,attrs:{class:"hljs-comment"}},[s._v("# Curl the file and use the -f flag for file to point at filterGenerateCsv.jq")]),s._v("\n$ curl https://gist.githubusercontent.com/austincunningham/eca562b35651b9a6dd214d0023c19cdf/raw | jq -f filterGenerateCsv.jq \n  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current\n                                 Dload  Upload   Total   Spent    Left  Speed\n100  5594  100  5594    0     0   9497      0 --:--:-- --:--:-- --:--:--  9481\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"\\"Node Name\\",\\"CPU Node - Real\\",\\"Memory Node - Real\\""')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"\\"ip-10-0-130-91.eu-west-1.compute.internal\\",\\"130m\\",\\"1596380Ki\\""')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"\\"ip-10-0-131-137.eu-west-1.compute.internal\\",\\"115m\\",\\"1257300Ki\\""')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"\\"ip-10-0-133-196.eu-west-1.compute.internal\\",\\"248m\\",\\"1787868Ki\\""')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"\\"ip-10-0-134-141.eu-west-1.compute.internal\\",\\"473m\\",\\"3330440Ki\\""')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"\\"ip-10-0-137-148.eu-west-1.compute.internal\\",\\"127m\\",\\"1485252Ki\\""')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"\\"ip-10-0-139-72.eu-west-1.compute.internal\\",\\"172m\\",\\"1524604Ki\\""')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"\\"ip-10-0-140-152.eu-west-1.compute.internal\\",\\"113m\\",\\"1276292Ki\\""')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"\\"ip-10-0-140-180.eu-west-1.compute.internal\\",\\"609m\\",\\"4152784Ki\\""')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"\\"ip-10-0-142-230.eu-west-1.compute.internal\\",\\"667m\\",\\"4110252Ki\\""')]),s._v("\n"),t("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"\\"ip-10-0-142-51.eu-west-1.compute.internal\\",\\"727m\\",\\"4080132Ki\\""')]),s._v("\n\n")])]),t("p",[s._v("More to learn here but I think jq will become something I will use more in the future. The files used in this blog are on this github "),t("a",{attrs:{href:"https://github.com/austincunningham/jq-what-i-learned-today"}},[s._v("repo")])])])}],r=t("2877"),l={},p=Object(r["a"])(l,n,e,!1,null,null,null);a["default"]=p.exports}}]);
//# sourceMappingURL=chunk-2d0e9ae6.5aae99b5.js.map