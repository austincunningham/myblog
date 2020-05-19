# Change Login Theme in Keycloak Docker image

![](https://dev-to-uploads.s3.amazonaws.com/i/ilddz1cwb0oibjn5cw8i.jpeg)

I was asked a question around how to change the theme in the Keycloak docker image and I had never tried it. So it was worth a blog. First pull the original image
```bash
docker pull jboss/keycloak
```
Then start the image
```bash
# Get the image 
docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
jboss/keycloak      latest              d9fadb38a379        10 days ago         739MB
# Then start the image with your username and password
docker run -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin jboss/keycloak
# Get the container id
docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                              NAMES
47dd5c82b073        jboss/keycloak      "/opt/jboss/tools/do…"   18 minutes ago      Up 4 minutes        0.0.0.0:8080->8080/tcp, 8443/tcp   angry_bouman
```
Login to the container with the CONTAINER ID
```bash
docker exec -it 47dd5c82b073 bin/bash
```
Create a directory for your theme in the container
```bash
mkdir /opt/jboss/keycloak/themes/raincatcher-theme
```
I blogged about creating a custom theme [here](https://austincunningham.ddns.net/2017/themekeycloak) so I have a git repo with a theme so I cloned it
```bash
git clone https://github.com/austincunningham/raincatcher-keycloak-theme.git
```
Copied the contents of the theme directory to the new directory on the running container
```bash
docker cp raincatcher-keycloak-theme/. 47dd5c82b073:/opt/jboss/keycloak/themes/raincatcher-theme
```
Restart the container
```bash
docker restart 47dd5c82b073
```
You should be able to select the image from the drop down once the container restarts
![](https://miro.medium.com/max/1400/1*MWi1EcA2pd6sSNA_-H1u5A.png)

Exit the `docker exec`

So that it , you will need to build a new image from the container and tag and push the image to save your changes.

```bash
# create a new image
docker commit 47dd5c82b073 keycloak-raincatcher-theme
# get the image
docker images
REPOSITORY                   TAG                 IMAGE ID            CREATED             SIZE
keycloak-raincatcher-theme   latest              e4b21b3b1d08        3 minutes ago       742MB
jboss/keycloak               latest              d9fadb38a379        10 days ago         739MB
# tag the image
docker tag e4b21b3b1d08 austincunningham/keycloak-raincatcher-theme:tryme
# Push the image to your container registry 
docker push austincunningham/keycloak-raincatcher-theme
The push refers to repository [docker.io/austincunningham/keycloak-raincatcher-theme]
2d33410048d1: Pushed 
fb389e3f2046: Pushed 
fca96e33d836: Pushed 
78a4ef8d1c42: Pushed 
133b5003f6eb: Pushed 
1776c40df06e: Pushed 
tryme: digest: sha256:3b6f1975247fc7ed01a67538b34d8c04155e07ee78a9235e076c71f1ba81c0a4 size: 1581
```
```bash
# My docker image can be got here
docker pull austincunningham/keycloak-raincatcher-theme
# And run with 
docker run -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin austincunningham/keycloak-raincatcher-theme:tryme
```

