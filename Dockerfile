FROM node:16.15-alpine

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build