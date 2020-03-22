
# JQ what I learned today
![](https://dev-to-uploads.s3.amazonaws.com/i/nntejen2pmrcn1iu1r0k.png)
---


## What's jq ?
A command line parser for json that can be downloaded [here](https://stedolan.github.io/jq/download/) or you can use the [playground](https://jqplay.org/). I will use this local json file as an beginner example hello-world.json
```json
{
  "hello": "world",
  "Water":{
    "Atlantic":"Ocean",
    "Pacific":"Ocean",
    "Mediterranean":{
      "Ocean": false,
      "Sea": true
    }
  },
  "Land":{
    "Europe":[
      "Ireland",
      "France",
      "Germany"
    ],
    "Asia":[
      "India",
      "China"
    ]
  }
}
```
## Using jq
Simplest use case is to render the whole json file and pretty print it
```bash
# You can pass filters and json files as arguments
jq '.' hello-world.json
# You can cat the file and pipe it to jq
cat hello-world.json | jq
# You can curl remote json and pipe it to jq e.g. from https://stedolan.github.io/jq/tutorial/
curl 'https://api.github.com/repos/stedolan/jq/commits?per_page=5' | jq '.'
```
![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/uavyatp5vhw1f08q0cfa.png)

## Filtering with jq
The [manual](https://stedolan.github.io/jq/manual/) is full of options for filtering and can be a lot to take in. We have seen already the most basic filter **'.'** which can be used with either method of invoking jq to return all data in the json.
```bash
# We can filter to specific keys
$ jq '.hello' hello-world.json                                               
"world"
#  you can create a new object and create a new json files
$ cat hello-world.json | jq .Water > water.json
{
  "Atlantic": "Ocean",
  "Pacific": "Ocean",
  "Mediterranean": {
    "Ocean": false,
    "Sea": true
  }
}
# We can drill down
$ cat hello-world.json | jq .Water.Atlantic
"Ocean"
$ cat hello-world.json | jq .Water.Mediterranean
{
  "Ocean": false,
  "Sea": true
}
$ cat hello-world.json | jq .Water.Mediterranean.Ocean
false
# arrays syntax is a little different
$ cat hello-world.json | jq '.Land.Europe[]'
"Ireland"
"France"
"Germany"
$ cat hello-world.json | jq '.Land.Europe'  
[
  "Ireland",
  "France",
  "Germany"
]
# Arrays can be accessed by indexes or splits [0:2]
$ cat hello-world.json | jq '.Land.Europe[0]'
"Ireland"
$ cat hello-world.json| jq '.Land.Europe[0:2]'
[
  "Ireland",
  "France"
]
# array symbol can be used to iterate over values
$ cat hello-world.json | jq '.Land[]
'
[
  "Ireland",
  "France",
  "Germany"
]
[
  "India",
  "China"
]
$ cat hello-world.json | jq '.Water[]'
"Ocean"
"Ocean"
{
  "Ocean": false,
  "Sea": true
}
# Lots of other array slicing methods available in the manual this is only scratching the surface
```
You can pipe multiple filters together and reassign values to create new json
```bash
$ cat hello-world.json | jq '.Land | .Europe | {EU:[{country:.[]}]}'
{
  "EU": [
    {
      "country": "Ireland"
    },
    {
      "country": "France"
    },
    {
      "country": "Germany"
    }
  ]
}

```
# Using jq files to do more advance stuff
You can use jq files as filters with the -f flag to create more complex filters with supporting functions. The file [Node-metrics.json](https://gist.github.com/austincunningham/eca562b35651b9a6dd214d0023c19cdf) has some cpu and memory usages stats from a Kubernetes Openshift cluster. I am looking to generate a report from this json.

I created the following file *filterGenerateCsv.jq* to filter the data in the json and creates an csv.
```bash
# function definition filter the data
def getNodeMetrics:
    [.items[]|
    {
        name:.metadata.name,
        cpu:.usage.cpu, 
        memory:.usage.memory
    }
    ];


# use geNodeUsages to generate csv
.[] |
getNodeMetrics |
group_by(.name) |
map({
  "Node Name": .[].name ,
  "CPU Node - Real": [.[].cpu] | add, 
  "Memory Node - Real": [.[].memory] | add
})| (.[0] | to_entries | map(.key)), (.[] | [.[]]) | @csv

#  (.[0] | to_entries | map(.key)) this filter sets the first array as follows
# [
#  "Node Name",
#  "CPU Node - Real",
#  "Memory Node - Real"
# ]
# (.[] | [.[]]) filter generates the arrays of values and @csv pipes to csv format
```
I can then call the jq file as my filter argument with the -f flag

```bash
# Curl the file and use the -f flag for file to point at filterGenerateCsv.jq
$ curl https://gist.githubusercontent.com/austincunningham/eca562b35651b9a6dd214d0023c19cdf/raw | jq -f filterGenerateCsv.jq 
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  5594  100  5594    0     0   9497      0 --:--:-- --:--:-- --:--:--  9481
"\"Node Name\",\"CPU Node - Real\",\"Memory Node - Real\""
"\"ip-10-0-130-91.eu-west-1.compute.internal\",\"130m\",\"1596380Ki\""
"\"ip-10-0-131-137.eu-west-1.compute.internal\",\"115m\",\"1257300Ki\""
"\"ip-10-0-133-196.eu-west-1.compute.internal\",\"248m\",\"1787868Ki\""
"\"ip-10-0-134-141.eu-west-1.compute.internal\",\"473m\",\"3330440Ki\""
"\"ip-10-0-137-148.eu-west-1.compute.internal\",\"127m\",\"1485252Ki\""
"\"ip-10-0-139-72.eu-west-1.compute.internal\",\"172m\",\"1524604Ki\""
"\"ip-10-0-140-152.eu-west-1.compute.internal\",\"113m\",\"1276292Ki\""
"\"ip-10-0-140-180.eu-west-1.compute.internal\",\"609m\",\"4152784Ki\""
"\"ip-10-0-142-230.eu-west-1.compute.internal\",\"667m\",\"4110252Ki\""
"\"ip-10-0-142-51.eu-west-1.compute.internal\",\"727m\",\"4080132Ki\""

```
More to learn here but I think jq will become something I will use more in the future. The files used in this blog are on this github [repo](https://github.com/austincunningham/jq-what-i-learned-today)
