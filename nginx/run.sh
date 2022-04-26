#!/bin/sh

CONTEXT_PATH=${CONTEXT_PATH:-''}

find build -type f -print0 | xargs -0 sed -i -e "s/##CONTEXT_PATH##/$CONTEXT_PATH/g"

envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" </app/nginx.tmpl >/etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
