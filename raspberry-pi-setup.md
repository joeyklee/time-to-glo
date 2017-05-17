# Raspberry pi setup:

* Download Etcher --> image burner

* Flash your system

* plug your SD card back into the rasp

* turn on the machine and set up

* open the terminal:
```
sudo apt update
sudo apt-get update
sudo apt-get upgrade
```

* follow this to install nodejs via nvm: http://raspberrypituts.com/nodejs-mongodb-web-server-raspberry-pi-tutorial/

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash

echo 'PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/bin"' >> ~/.bashrc
 
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
 
echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"' >> ~/.bashrc
 
source ~/.bashrc

nvm install 7.10.0

```

* install git

```
sudo apt install git
```


