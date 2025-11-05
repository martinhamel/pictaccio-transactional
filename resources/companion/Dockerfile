FROM node:18.11.0-buster-slim AS pictaccio-admin-final-unsafe
MAINTAINER Roxanne Courchesne <rcourchesne@loufa.io>

COPY build/runServer.sh /

WORKDIR /app_src
COPY src/ ./src
COPY package.json package-lock.json ./
COPY tsconfig.container.json ./tsconfig.json
COPY ormconfig.k8s.json ./ormconfig.json
COPY build/typeorm_init.ts ./build/typeorm_init.ts
COPY .npmrc /root/
RUN apt update && apt install rsync tmux htop -y; \
    npm install --force; \
    npm run build

WORKDIR /app
COPY package.json package-lock.json ./
RUN chmod +x /runServer.sh; \
    chown www-data:www-data -R ./; \
    npm install --production --force;  \
    rm ~/.npmrc

EXPOSE 3000
EXPOSE 9229
CMD [ "node", "entry.js" ]

FROM pictaccio-admin-final-unsafe AS pictaccio-admin-final

RUN rm -rf /app/database/migrations/*; \
    rm -rf /app/package*.json; \
    rm -rf /node_modules; \
    rm -rf /app_src;

EXPOSE 3000
USER www-data
CMD [ "node", "entry.js" ]
