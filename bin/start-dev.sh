#!/usr/bin/env sh
cd docker
docker-compose -f docker-compose.yml -f docker-compose-with-api.yml up -d
: