# Debug Kubernetes Operator-sdk v1.0.0 locally in Goland

![](https://thepracticaldev.s3.amazonaws.com/i/4n0nt3dyb3k20u8h7d7x.png)


Wrote this [Debug Kubernetes Operator-sdk locally in Goland](https://austincunningham.ddns.net/2020/operatorgoland) last year before the first major release of the Operator-sdk. Due to changes in the Operator-sdk it's not valid for version v1.0.0 and greater.

Here are the steps to get debug running with v1.0.0

In Goland go to `Run\Edit Configurations`

Select `Go Build\+`

Give the configuration a name

In Files add the path to main.go

In Environment add `WATCH_NAMESPACE=your-operators-namespace`
 
![Setup goland debug](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ljom1l0y2m0xyq18wfoq.gif)

You can then run the debug from the Run menu

Go to run\debug

Select the configuration name you just setup

Debug will start and stop at break points

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/stwvuc360csp941liec0.gif)
