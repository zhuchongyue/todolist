FROM node:18.14.2-alpine3.17

WORKDIR /app

COPY . .

RUN corepack enable
RUN corepack prepare yarn@3.4.1 --activate
RUN yarn install

EXPOSE 8088 3000

CMD ["yarn", "dev"]