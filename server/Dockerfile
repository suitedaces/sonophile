# It uses node:18-alpine as the base image for the Node.js application
FROM node:18-alpine

RUN npm install -g nodemon

WORKDIR /sonophile

COPY package.json .

#Installing all dependencies in the container
RUN npm install

COPY . .

#Exposing the container to run on this port 8888
EXPOSE 8888

# Command to start the Docker container for the backend
CMD ["npm", "start"]
