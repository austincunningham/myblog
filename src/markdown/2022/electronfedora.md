
# Create an Electron app on Fedora

![banner image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/et2nn3q91f79mxs3aphg.png)


## Creating the Electron App
Wanted to play around with creating a desktop app with Electron on Fedora. Followed the [quick start guide](https://www.electronjs.org/docs/latest/tutorial/quick-start) for Electron changing the `win.loadFile` to `win.loadURL` to load an existing web app. Code is [here](https://github.com/austincunningham/electron-github) here is my main.js
```js
const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 850,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadURL('https://austincunningham.github.io/Git_Repos_Rest_API/lab-4.1-Github-API/index.html')

}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
```
Testing the app by running `npm start` and the app opens
![Image of the app open](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l6bq735g2m2f64knrwb2.png)
That seems straight forward.

## Building the binary
Again following the [quick start guide](https://www.electronjs.org/docs/latest/tutorial/quick-start#package-and-distribute-your-application) I get to the `npm run make` command here is where I hit some trouble
```bash
npm run make

> electron-github@1.0.0 make /home/austincunningham/repo/electron-github
> electron-forge make

✔ Checking your system
✔ Resolving Forge Config

An unhandled rejection has occurred inside Forge:
Error: Cannot make for deb, the following external binaries need to be installed: dpkg, fakeroot

Electron Forge was terminated. Location:
```
So I install the missing dependencies
```bash
sudo dnf install dpkg
sudo dnf install fakeroot
```
I rerun the `npm run make` command
```bash
npm run make

> electron-github@1.0.0 make /home/austincunningham/repo/electron-github
> electron-forge make

✔ Checking your system
✔ Resolving Forge Config

An unhandled rejection has occurred inside Forge:
Error: Cannot make for rpm, the following external binaries need to be installed: rpmbuild

Electron Forge was terminated. Location:
```
So I guess there is another missing dependency I try and install `rpmbuild`
```bash
sudo dnf install rpmbuild
No match for argument: rpmbuild
Error: Unable to find a match: rpmbuild
```
I figure it rpm related so Googled it and find https://www.redhat.com/sysadmin/create-rpm-package 
I install the dependencies from the blog
```bash
sudo dnf install -y rpmdevtools rpmlint
```
And happy days the `npm run make` completes 
```bash
npm run make                            

> electron-github@1.0.0 make /home/austincunningham/repo/electron-github
> electron-forge make

✔ Checking your system
✔ Resolving Forge Config
We need to package your application before we can make it
✔ Preparing to Package Application for arch: x64
✔ Preparing native dependencies
✔ Packaging Application
Making for the following targets: deb, rpm
✔ Making for target: deb - On platform: linux - For arch: x64
✔ Making for target: rpm - On platform: linux - For arch: x64
```
It built the deb and rpm bundles, guessing need to be run on windows and mac to build their binaries. More to learn here but that's all for now. 
