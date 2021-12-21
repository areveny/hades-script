aws s3 sync s3://hades-script-static/hades-db/ .
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 16
npm install https://github.com/mapbox/node-sqlite3/tarball/master
npm install