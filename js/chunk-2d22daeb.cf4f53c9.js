(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d22daeb"],{f913:function(s,t,a){"use strict";a.r(t);var e=function(){var s=this,t=s.$createElement;s._self._c;return s._m(0)},r=[function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("section",[a("h1",[s._v("Specify what appears in Golang test coverage")]),a("p",[a("img",{attrs:{src:"https://ih1.redbubble.net/image.394876330.4085/flat,1000x1000,075,f.jpg?style=centerme",alt:""}})]),a("p",[s._v("While working on a "),a("a",{attrs:{href:"https://github.com/integr8ly/cloud-resource-operator"}},[s._v("project")]),s._v(" using the "),a("a",{attrs:{href:"https://github.com/operator-framework/operator-sdk"}},[s._v("Operator-sdk")]),s._v(" I found that test coverage was quite low. The reason was that of a lot of generated deepcopy files in the repo due to the Operator-sdk.")]),a("h2",[s._v("Initial Test Setup")]),a("p",[s._v("First I am using the following repo to add colours to my tests for readability")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("go get -u github.com/rakyll/gotest\n")])]),a("p",[a("img",{attrs:{src:"https://cdn-images-1.medium.com/max/800/1*NMpESGLLr9CX7NxIhiaztg.png",alt:"colour tests"}})]),a("p",[s._v("I test the pkg directory which I tested with the follow command")]),a("p",[a("img",{attrs:{src:"https://cdn-images-1.medium.com/max/800/1*JMNogSg252CZmXYUi-GcLg.png",alt:""}})]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("gotest -v -covermode=count -coverprofile=coverage.out ./pkg/...\n")])]),a("p",[s._v("This runs the test and outputs the test coverage to a file coverage.out you can check the coverage locally using the html flag")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("go tool cover -html=coverage.out\n")])]),a("p",[a("img",{attrs:{src:"https://cdn-images-1.medium.com/max/800/1*gd969OOScshXl2O2OuJ3cg.png",alt:""}})]),a("p",[s._v("Or you can use the func flag which give you the functions percentage coverage in the cli")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("go tool cover -func=coverage.out\n")])]),a("p",[a("img",{attrs:{src:"https://cdn-images-1.medium.com/max/800/1*vqoYfC2U_dVVDdWJXr88gA.png",alt:""}})]),a("h2",[s._v("Refining the coverage")]),a("p",[s._v("As I was never going to test the generated files I decided to see if I could remove them from our code coverage report. At first I looked at the go test -run flag in the following format")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("gotest ./packagedirectory -run=testname\n")])]),a("p",[s._v("I found it would have too much maintenance to update.")]),a("p",[s._v("Next I tried using it with regex to try and hit all test but found that with a greedy regex expression like "),a("code",{pre:!0},[s._v("-run=^Test.+")]),s._v(" I would hit all test but also all files so I was back where I started.")]),a("p",[s._v("The directory pkg/apis was where the generated deepcopy files were located. I moved the files that I was testing to a from pkg/apis to a sub package called types and filtered my tests by directory instead. So my test command looked like")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-bash"}},[s._v("gotest -v -covermode=count -coverprofile=coverage.out ./pkg/controller/... ./pkg/providers/... ./pkg/resources/... ./pkg/apis/integreatly/v1alpha1/types/...\n")])]),a("p",[s._v("This runs the tests in the directories listed above and updates the coverage.out with only the files in this directory.  This increased my overall coverage by about 14%")]),a("h2",[s._v("CI/CD and coveralls")]),a("p",[s._v("We were using Travis for CI/CD and setup coveralls with the following config in "),a("code",{pre:!0},[s._v(".travis.yml")]),s._v(".")]),a("pre",{pre:!0},[a("code",{pre:!0,attrs:{"v-pre":"",class:"language-yaml"}},[a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("language:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("go")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("sudo:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("required")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("dist:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("bionic")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("go:")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-number"}},[s._v("1.13")]),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v(".x")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("env:")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("GO111MODULE=on")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("addons:")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("apt:")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("update:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("true")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("packages:")]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"python3"')]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"python3-pip"')]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v('"python3-setuptools"')]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("git:")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("depth:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-number"}},[s._v("1")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("stages:")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("name:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("test")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("name:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("push")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("if:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("fork")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("false")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("name:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("manifest")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("if:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("fork")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-literal"}},[s._v("false")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("AND")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("tag")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("IS")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("present")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("before_install:")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("go")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("get")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("github.com/mattn/goveralls")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("jobs:")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("include:")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("stage:")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("test")]),s._v("\n      "),a("span",{pre:!0,attrs:{class:"hljs-attr"}},[s._v("script:")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("go")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("get")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("github.com/mattn/goveralls")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("go")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("get")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("-u")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("github.com/rakyll/gotest")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("gotest")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("-v")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("-covermode=count")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("-coverprofile=coverage.out")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("./pkg/controller/...")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("./pkg/providers/...")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("./pkg/resources/...")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("./pkg/apis/integreatly/v1alpha1/types/...")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"hljs-bullet"}},[s._v("-")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("$GOPATH/bin/goveralls")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("-coverprofile=coverage.out")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("-service=travis-ci")]),s._v(" "),a("span",{pre:!0,attrs:{class:"hljs-string"}},[s._v("-repotoken=$COVERALLS_TOKEN")]),s._v("\n")])]),a("p",[s._v("For more information on setting up "),a("code",{pre:!0},[s._v("-repotoken=$COVERALLS_TOKEN")]),s._v("\nSee the goveralls repo https://github.com/mattn/goveralls and https://docs.coveralls.io/go")]),a("p",[s._v("With this setup we can then check our coverage as part of the PR , This doesn't replace writing tests but does eliminate generated files from the coverage report.")]),a("p",[a("img",{attrs:{src:"https://cdn-images-1.medium.com/max/800/1*5MG3-9LyPwo2kJFt81ibRw.png",alt:""}})])])}],l=a("2877"),n={},p=Object(l["a"])(n,e,r,!1,null,null,null);t["default"]=p.exports}}]);
//# sourceMappingURL=chunk-2d22daeb.cf4f53c9.js.map