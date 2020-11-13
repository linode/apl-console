# --------------- dev stage for developers to override sources
FROM node:13.10.1-alpine as dev
ARG NPM_TOKEN
RUN test -n "$NPM_TOKEN"

RUN apk --no-cache add make gcc g++ python
ENV NODE_ENV=development

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY .npmrc ./
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc

RUN echo "SKIP_PREFLIGHT_CHECK=true" > .env
RUN echo "EXTEND_ESLINT=true" >> .env

RUN npm ci

# --------------- ci stage for CI runner
FROM dev as ci

ENV NODE_ENV=test

COPY ts*.json .es* .prettier*  ./
COPY src src
COPY public public

RUN echo "SKIP_PREFLIGHT_CHECK=true" > .env
RUN echo "EXTEND_ESLINT=true" >> .env

# ARG CI=true
RUN npm run lint
# RUN npm run test

RUN npm run build

# --------------- production stage
FROM openresty/openresty:1.17.8.2-5-alpine-fat as prod

RUN luarocks install lua-resty-jwt
RUN luarocks install lua-resty-http
# RUN luarocks install cjson
RUN luarocks install date

# # Install app
RUN mkdir /app
WORKDIR /app

COPY nginx/ ./
RUN chmod +x /app/run.sh

COPY --from=ci /app/build build
COPY  keycloak /app/keycloak

RUN chmod +r /app/build

CMD ["sh", "-c", "/app/run.sh"]