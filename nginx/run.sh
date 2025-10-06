#!/bin/sh

CONTEXT_PATH=${CONTEXT_PATH:-''}

find build -type f -print0 | xargs -0 sed -i -e "s/##CONTEXT_PATH##/$CONTEXT_PATH/g"

# Generate nginx.conf with proper DNS resolver
sed "s/\${KUBE_DNS_SERVICE_HOST}/$KUBE_DNS_SERVICE_HOST/g" /app/nginx.tmpl > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
