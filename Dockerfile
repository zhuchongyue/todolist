FROM node:18.14.2-alpine3.17

WORKDIR /app

COPY . .

RUN corepack enable
RUN corepack prepare yarn@3.4.1 --activate
# RUN yarn init -2
# RUN yarn config set  httpProxy http://192.168.3.157:15236
# RUN yarn config set  httpsProxy http://192.168.3.157:15236
# RUN yarn config set  httpProxy http://127.0.0.1:15236
# RUN yarn config set  httpsProxy http://127.0.0.1:15236

# RUN ifconfig
# RUN yarn plugin import workspace-tools
# RUN yarn install
# RUN ls
RUN yarn install
RUN ls /app

EXPOSE 8088 3000

CMD ["yarn", "dev"]