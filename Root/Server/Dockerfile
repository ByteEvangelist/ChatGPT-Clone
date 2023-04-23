# Dockerfile copied from nodejs.org example Dockerfile
# Adapted to ChatGPT-Clone Server node app
# https://nodejs.org/en/docs/guides/nodejs-docker-webapp

FROM node:16

# Create app directory
WORKDIR /home/matt/ChatGPT-clone

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# Also, according to nodejs.org guide, `npm ci --omit=dev` is preferred
# but We're gonna stick to `npm install`, since it makes it easier

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]