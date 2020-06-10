#!/usr/bin/env sh

alias dc="docker-compose -f docker-compose-with-api.yml -f docker-compose-e2e.yml"

if [ "$CI" = "true" ]; then
  dc up --exit-code-from e2e
else
  sh ./start.sh
  docker run -it --rm -e CYPRESS_baseUrl=http://kubernetes.docker.internal:3000 eu.gcr.io/otomi-cloud/otomi-stack-e2e:${WEB_TAG:-latest}
fi