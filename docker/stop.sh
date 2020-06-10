#!/usr/bin/env sh

docker-compose -f docker-compose.yml -f docker-compose-with-api.yml down --remove-orphans