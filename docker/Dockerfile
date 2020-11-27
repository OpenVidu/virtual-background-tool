FROM node:lts-alpine3.11

WORKDIR /opt/virtual-background-tool

COPY backend/package.json package.json
COPY backend/public public
COPY backend/server.js server.js

RUN npm install

CMD ["node_modules/nodemon/bin/nodemon.js", "server.js"]