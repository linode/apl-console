# --------------- dev stage for developers to override sources
FROM node:17.9.0-alpine as dev
# ARG NPM_TOKEN
# RUN test -n "$NPM_TOKEN"

RUN apk --no-cache add make gcc g++ python
ENV NODE_ENV=development

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

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
RUN npm test -- --watchAll=false
RUN npm run build

# --------------- production stage
FROM openresty/openresty:1.17.8.2-5-alpine-fat as prod

RUN mkdir /app
RUN addgroup -S app &&\
  adduser -S app -G app -h /app -s /sbin/nologin
ENV HOME=/app
WORKDIR /app

COPY nginx/ ./
RUN chmod +x /app/run.sh

COPY --from=ci --chown=app /app/build build
COPY --chown=app keycloak /app/keycloak

RUN chown -R app:app /app
RUN chown -R app:app /usr/local

USER app

CMD ["sh", "-c", "/app/run.sh"]