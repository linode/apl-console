#!/bin/sh

CONTEXT_PATH=${CONTEXT_PATH:-''}

if [ -n "$CONTEXT_PATH" ]; then
  CONTEXT_PATH="/$(printf '%s' "$CONTEXT_PATH" | sed 's#^/*##; s#/*$##')"
fi

CONTEXT_PATH_SEGMENT=${CONTEXT_PATH#/}

find build -type f -print0 | xargs -0 sed -i \
  -e "s|##CONTEXT_PATH##|$CONTEXT_PATH|g" \
  -e "s|##CONTEXT_PATH_SEGMENT##|$CONTEXT_PATH_SEGMENT|g"

# Extract DNS nameserver for nginx resolver (fallback to resolv.conf if env var not set)
DNS_SERVER=${KUBE_DNS_SERVICE_HOST:-$(awk '/^nameserver/{print $2; exit}' /etc/resolv.conf)}

# Generate nginx.conf with DNS resolver substituted
sed "s/\${KUBE_DNS_SERVICE_HOST}/$DNS_SERVER/g" /app/nginx.tmpl > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
