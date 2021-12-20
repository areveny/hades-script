FROM node:16

WORKDIR /hades-db

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["node", "query.js"]