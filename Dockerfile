# --------------- dev stage for developers to override sources
FROM node:13.10.1-alpine as dev

RUN apk --no-cache add make gcc g++ python
ENV NODE_ENV=development

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm ci

# --------------- ci stage for CI runner
FROM dev as ci

ENV NODE_ENV=test

COPY ts*.json .es* ./
COPY src src
COPY cypress cypress
COPY public public
COPY bin bin

# ARG CI=true
RUN npm run lint
# RUN npm run test

# --------------- build stage
FROM ci as build

RUN PUBLIC_URL='##PUBLIC_URL##' npm run build

# --------------- production stage
FROM nginx:1.16.1-alpine as prod

# # Install app
RUN mkdir /app
WORKDIR /app


COPY nginx.tmpl run.sh ./
RUN chmod +x /app/run.sh

COPY --from=build /app/build build

RUN chmod +r /app/build

CMD ["sh", "-c", "/app/run.sh"]