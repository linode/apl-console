
#!/bin/sh

PUBLIC_URL=''
CONTEXT_PATH=${CONTEXT_PATH:-}
if [ $CONTEXT_PATH != "" ]; then
  PUBLIC_URL="\/$CONTEXT_PATH"
fi

export PUBLIC_URL

find build -type f -print0 | xargs -0 sed -i -e "s/##PUBLIC_URL##/$PUBLIC_URL/g"

envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" <nginx.tmpl >/etc/nginx/nginx.conf

exec nginx -g 'daemon off;'