# --------------- dev stage for developers to override sources
FROM node:20.19.5-alpine as dev

RUN apk --no-cache add make gcc g++ python3
ENV NODE_ENV=development

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
COPY linode-kubeseal-encrypt-1.0.0.tgz ./

RUN echo "SKIP_PREFLIGHT_CHECK=true" > .env
RUN echo "EXTEND_ESLINT=true" >> .env

RUN npm ci

# --------------- ci stage for CI runner
FROM dev as ci

ENV NODE_ENV=test
ENV NODE_OPTIONS=--max-old-space-size=4096

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
FROM nginx:1.29.3-alpine as prod

RUN mkdir /app
RUN addgroup -S app && adduser -S app -G app -h /app -s /sbin/nologin
RUN mkdir -p /var/run/nginx /var/tmp/nginx && chown -R app:app /etc/nginx /usr/share/nginx /var/run/nginx /var/tmp/nginx
ENV HOME=/app
WORKDIR /app

COPY nginx/ ./
RUN chmod +x /app/run.sh

COPY --from=ci /app/build build
COPY /console-keycloak/APL.jar /app/

RUN chown -R app:app /app

USER app

CMD ["sh", "-c", "/app/run.sh"]