FROM node:16-alpine3.14 as builder

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build