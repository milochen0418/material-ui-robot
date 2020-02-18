# build env
FROM node:12.14-alpine as build

# Create Directory for the Container
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .

RUN yarn install
RUN yarn build

# prod env
FROM nginx:1.17.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .

# Add bash
RUN apk add --no-cache bash

RUN chmod +x env.sh

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
