#!/bin/sh

CONTEXT_PATH=${CONTEXT_PATH:-''}

find build -type f -print0 | xargs -0 sed -i -e "s/##CONTEXT_PATH##/$CONTEXT_PATH/g"

# Get DNS nameserver from /etc/resolv.conf or use KUBE_DNS_SERVICE_HOST if available
DNS_SERVER=${KUBE_DNS_SERVICE_HOST:-$(grep -m1 '^nameserver' /etc/resolv.conf | awk '{print $2}')}

# Generate nginx.conf with proper DNS resolver
sed "s/\${KUBE_DNS_SERVICE_HOST}/$DNS_SERVER/g" /app/nginx.tmpl > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
