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
COPY public public

# ARG CI=true
RUN npm run lint
# RUN npm run test

# --------------- build stage
FROM ci as build

RUN npm run build

# --------------- production stage
FROM nginx:1.16.1-alpine as prod

# # Install app
RUN mkdir /app
WORKDIR /app

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build build