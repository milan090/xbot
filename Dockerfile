FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only-prod
RUN npm install pm2 -g

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV BUILD=js

CMD ["pm2-runtime", "./dist/main.js"]