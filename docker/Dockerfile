FROM node:lts-alpine3.11

WORKDIR /opt/openvidu-virtual-background-tool

COPY backend/package.json package.json
COPY backend/public public
COPY backend/server.js server.js

# Entrypoint
COPY docker/entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/entrypoint.sh && \
    npm install

CMD ["/usr/local/bin/entrypoint.sh"]