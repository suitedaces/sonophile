# Use a Node.js image for building the client
FROM node:18 as build

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN npm install

COPY . .

RUN npm run build