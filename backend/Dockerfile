FROM node:12.14-alpine

# Create Directory for the Container
WORKDIR /usr/src/user-infra-api

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

# Copy all other source code to work directory
ADD . .

RUN yarn build

# Start server
CMD [ "yarn", "start" ]
EXPOSE 8081
