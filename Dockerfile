FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only-prod

COPY . .

RUN npm run build

ENV NODE_ENV=production
ENV BUILD=js

CMD ["npm", "start"]