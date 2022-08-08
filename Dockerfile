FROM node:16-alpine

WORKDIR /app
COPY . .

RUN apk add --no-cache git openssh
RUN yarn install
RUN yarn build

CMD [ "yarn", "export" ]