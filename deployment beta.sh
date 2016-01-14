#!/bin/bash -e
clear

echo "CHECKING IF MONGODB IS INSTALLED"
which mongo
if [ $? -eq 0 ]; then
    echo "MONGODB is installed"
else
    echo "MONGODB is not yet installed"
#
# Install MongoDB
#
echo "ADD MONGODB APT-GET REPOSITORY"
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list

echo "UPDATE APT-GET CACHE"
apt-get update

echo "INSTALL MONGODB-ORF"
apt-get install -y mongodb-org

mkdir -p /data/db
sudo chown -R $USER /data/db
# Fix MongoDB trouble
rm /var/lib/mongodb/mongod.lock
mongod --repair
sed -i s:'#port = 27017':'port = 27017': /etc/mongod.conf
sed -i s:'bind_ip = 127.0.0.1':'#bind_ip = 127.0.0.1': /etc/mongod.conf
echo 'smallfiles = true' >> /etc/mongod.conf
service mongod restart

fi

echo "INSTALL GIT AND FIREFOX"
apt-get install git -y
apt-get install firefox -y

which node
if [ $? -eq 0 ]; then
    	echo "NODE is allready installed"
else
	echo "NODE.JS DOWNLOAD AND UNPACKING"
	cd /home/developer/Downloads
	wget https://nodejs.org/dist/v0.12.7/node-v0.12.7.tar.gz
	tar -xvzf node-v0.12.7.tar.gz
	echo "INSTALL G++ C-COMPILER"
	apt-get install g++ -y
	
	echo "BUILD NODE.JS FROM SOURCE"
	cd node-v0.12.7
	./configure
	make
	make install
	cd ../
fi

echo "INSTALL NODEMON AND MOCHA"
npm install -g nodemon
npm install -g mocha
npm install -g selenium

echo "GIT clone to /home/developer/project folder"
mkdir /project/
cd /project
git clone https://github.com/MarkDuijf/DWA-Project-SocketDesign-Pingu.git

echo "PREPARE PROJECT"
cd /project/DWA-Project-SocketDesign-Pingu/WebSocketDesigner/
npm install

echo "DONE installing, will now exit"
exit
