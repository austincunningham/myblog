
# Specify what appears in Golang test coverage 

![](https://ih1.redbubble.net/image.394876330.4085/flat,1000x1000,075,f.jpg?style=centerme)


While working on a [project](https://github.com/integr8ly/cloud-resource-operator) using the [Operator-sdk](https://github.com/operator-framework/operator-sdk) I found that test coverage was quite low. The reason was that of a lot of generated deepcopy files in the repo due to the Operator-sdk.

## Initial Test Setup

First I am using the following repo to add colours to my tests for readability

```bash
go get -u github.com/rakyll/gotest
```

![colour tests](https://cdn-images-1.medium.com/max/800/1*NMpESGLLr9CX7NxIhiaztg.png)

I test the pkg directory which I tested with the follow command

![](https://cdn-images-1.medium.com/max/800/1*JMNogSg252CZmXYUi-GcLg.png)

```bash
gotest -v -covermode=count -coverprofile=coverage.out ./pkg/...
```

This runs the test and outputs the test coverage to a file coverage.out you can check the coverage locally using the html flag 

```bash
go tool cover -html=coverage.out
```

![](https://cdn-images-1.medium.com/max/800/1*gd969OOScshXl2O2OuJ3cg.png)

Or you can use the func flag which give you the functions percentage coverage in the cli 

```bash
go tool cover -func=coverage.out
```

![](https://cdn-images-1.medium.com/max/800/1*vqoYfC2U_dVVDdWJXr88gA.png)

## Refining the coverage
As I was never going to test the generated files I decided to see if I could remove them from our code coverage report. At first I looked at the go test -run flag in the following format
```bash
gotest ./packagedirectory -run=testname
```
I found it would have too much maintenance to update.

Next I tried using it with regex to try and hit all test but found that with a greedy regex expression like `-run=^Test.+` I would hit all test but also all files so I was back where I started.

The directory pkg/apis was where the generated deepcopy files were located. I moved the files that I was testing to a from pkg/apis to a sub package called types and filtered my tests by directory instead. So my test command looked like

```bash
gotest -v -covermode=count -coverprofile=coverage.out ./pkg/controller/... ./pkg/providers/... ./pkg/resources/... ./pkg/apis/integreatly/v1alpha1/types/...
```
This runs the tests in the directories listed above and updates the coverage.out with only the files in this directory.  This increased my overall coverage by about 14%

## CI/CD and coveralls
We were using Travis for CI/CD and setup coveralls with the following config in `.travis.yml`.

```yaml
language: go

sudo: required
dist: bionic

go:
  - 1.13.x

env:
  - GO111MODULE=on

addons:
  apt:
    update: true
    packages:
      - "python3"
      - "python3-pip"
      - "python3-setuptools"

git:
  depth: 1

stages:
  - name: test
  - name: push
    if: fork = false
  - name: manifest
    if: fork = false AND tag IS present

before_install:
  - go get github.com/mattn/goveralls

jobs:
  include:
    - stage: test
      script:
        - go get github.com/mattn/goveralls
        - go get -u github.com/rakyll/gotest
        - gotest -v -covermode=count -coverprofile=coverage.out ./pkg/controller/... ./pkg/providers/... ./pkg/resources/... ./pkg/apis/integreatly/v1alpha1/types/...
        - $GOPATH/bin/goveralls -coverprofile=coverage.out -service=travis-ci -repotoken=$COVERALLS_TOKEN
```
For more information on setting up `-repotoken=$COVERALLS_TOKEN`
See the goveralls repo https://github.com/mattn/goveralls and https://docs.coveralls.io/go

With this setup we can then check our coverage as part of the PR , This doesn't replace writing tests but does eliminate generated files from the coverage report.

![](https://cdn-images-1.medium.com/max/800/1*5MG3-9LyPwo2kJFt81ibRw.png)