FROM node:18-alpine

WORKDIR /sonophile

COPY package.json .

#Installing all the tools and dependencies in the container
RUN npm install

COPY . .

#Exposing the container to run on this port 5173
EXPOSE 5173

# Command to start the Docker container for the frontend React+Vite application
CMD ["npm", "run", "dev"]