# Free Web Site Hosting

![](https://cdn-images-1.medium.com/max/800/1*vd3vrus3rzuFsQZhOkNa-w.jpeg)

There are many options for hosting and this is not a exhaustive list just some of the options I have tried. 

## Surge.sh 

Command line deployment tool for static websites and SPA's
Install
```bash
npm install --global surge
```

Change directory to your project with your index.html file
```bash
cd project-dir
ls
index.html
```

Run surge to publish your site

![](https://surge.sh/images/help/getting-started-with-surge.gif)

By default your given a cname in the surge.sh domain, but you can set a [custom domain](https://surge.sh/help/adding-a-custom-domain) as long as you have some [dns hosting](https://www.maketecheasier.com/best-dynamic-dns-providers/). 

Love this option as it is so simple to configure and the Surge.sh docs are great. One gotcha is if you forget the usename and password there may be no way to recover access to your site.

## Github's gh-pages 

You can host static websites and SPA's from gh-pages

You can add gh-page to any repo

Find out more [here](https://pages.github.com/) on how to setup github pages

By default you are given a domain in the following https://**git-user-name**.github.io/**repo-name**, again you can set a custom domain in settings

![](https://cdn-images-1.medium.com/max/800/1*wAVZk06bHz8lGt4pnkjdYw.png)

add your custom domain in the box provided, again you need dns hosting.

I have done this on many projects weather its just to jazz up a [doc's page](http://change-oc.ddns.net/README.html) or my hosting of this [blog](https://github.com/austincunningham/myblog).

## Heroku

![](https://cdn-images-1.medium.com/max/800/1*wBWMeBZBLbITHT0EcsZfyA.png)

Heroku is an PAAS offering for hosting apps. You can deploy a [node app on heroku](https://devcenter.heroku.com/articles/deploying-nodejs). Setting a up an Express.js app to serve a directory see the [first section here](https://austincunningham.ddns.net/2018/hostingopenshift) for how to steps. 

Haven't used since college but the free tier works well. I do remember that the config could be a pain point at times.

## Glitch

![](https://thepracticaldev.s3.amazonaws.com/i/juvetcvfipn4m73tdcx6.png)

[Glitch](https://glitch.com) from the nice people that brought you stackoverflow. Its a hosting platform for node.js apps as with heroku you would need to set up an express app to serve the static content. Only issue with this option is you don't get to decide your domain name and I haven't as yet figure a way around this. 

## Self Hosting on a Local PC

![](https://cdn-images-1.medium.com/max/800/1*rweIglsq5NH-iKE-reP1OA.jpeg)

Hosting of a local PC If you are lucky enough to have a public ip address its as simple as setting up

[Apache web server](https://vitux.com/how-to-install-and-configure-apache-web-server-on-ubuntu/)  

[Nginx web server](https://mediatemple.net/community/products/developer/204405534/install-nginx-on-ubuntu) 

As outline it the above examples static web files will be served from `/var/www/` directory.
But most people don't have public IP so may have to look at a dynamic dns provider. 

e.g. [noip.com](https://www.noip.com/support/knowledgebase/how-to-configure-ddns-in-router/) which give you an option to setup ddns on your router or have software running on your pc that that will updates the dns when the ip address changes. 

I learned a lot doing this and even got around to setting up my own dovecot email server. It wouldn't be my goto for hosting now, but as a learning exercise it's worth a try. Pain point loss of power or ISP outage and your site is offline. Same if your hardware goes bang. 


## Cloud Hosting
If you are going down the Apache/Nginx route you may be better off signing up free tier cloud offering many of which give a free year

[Amazon EC2](https://aws.amazon.com/free/?all-free-tier.sort-by=item.additionalFields.SortRank&all-free-tier.sort-order=asc&awsf.Free%20Tier%20Types=categories%23featured)

[Azure](https://azure.microsoft.com/en-us/free/free-account-faq/)

[GCP](https://cloud.google.com/free/docs/gcp-free-tier)

There are pros and cons for both methods of using Apache/Nginx but the Cloud will scale better and will be more reliable that Self hosting. Pain point you have to watch the billing like a hawk in case you go beyond the free tier usage.