#!/bin/sh

CONTEXT_PATH=${CONTEXT_PATH:-''}
CONSOLE_MODE=${CONSOLE_MODE:-'ce'}

find build -type f -print0 | xargs -0 sed -i -e "s/##CONTEXT_PATH##/$CONTEXT_PATH/g" -e "s/##CONSOLE_MODE##/$CONSOLE_MODE/g"

# envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" <nginx.tmpl >/etc/nginx/nginx.conf
envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" <nginx.tmpl >/usr/local/openresty/nginx/conf/nginx.conf

# exec nginx -g 'daemon off;'
exec openresty -g 'daemon off;'