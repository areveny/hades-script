rsync -rav --exclude-from='.gitignore' * ---:~

sudo yum update -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16
npm install pm2 -g

# ~/query-service
cd query-service
npm install https://github.com/mapbox/node-sqlite3/tarball/master
npm install
pm2 start query.js

# ~/web-service
cd web-service
sudo amazon-linux-extras install nginx1 -y
npm install
pm2 start webserve.js

# nginx
sudo cp hades-script.conf /etc/nginx/conf.d
sudo systemctl start nginx.service

# Deploy
scp -r -i --- frontend/build :~/frontend/build