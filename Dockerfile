# --------------- Dev stage for developers to override sources
FROM node:13.7.0-alpine as dev

RUN apk --no-cache add make gcc g++ python

ENV NODE_ENV=development
ENV BLUEBIRD_DEBUG=0

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm ci

# --------------- ci stage for CI runner
FROM dev as ci

# COPY --from=dev /app/node_modules node_modules
COPY .  ./
# ARG CI=true
ENV NODE_ENV=test
# tests should be executed in parallel (on a good CI runner)
# by calling this 'ci' stage with different commands (i.e. npm run test:lint)

WORKDIR /app

# RUN npm run lint
# RUN npm run test
RUN npm run build --production

# --------------- Production stage
FROM ci AS clean

RUN npm install --production

# --------------- Production stage
FROM alpine:3.11 AS prod


COPY --from=dev /usr/local/bin/node /usr/bin/
COPY --from=dev /usr/lib/libgcc* /usr/lib/
COPY --from=dev /usr/lib/libstdc* /usr/lib/

# Install app
RUN mkdir /app
WORKDIR /app
COPY --from=clean /app/node_modules node_modules
COPY --from=ci /app/build build
COPY serve.json .

USER 1001
EXPOSE 5000

CMD ["node", "--max-http-header-size=16384", "node_modules/serve/bin/serve.js"]
