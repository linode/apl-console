
#!/bin/sh

PUBLIC_URL=''
CONTEXT_PATH=${CONTEXT_PATH:-}
ALIAS_LOCATION=''
CONTEXT_LOCATION=''
if [ $CONTEXT_PATH != "" ]; then
  ALIAS_LOCATION="alias /app/build;"
  CONTEXT_LOCATION="@$CONTEXT_PATH"
  PUBLIC_URL="\/$CONTEXT_PATH"
fi

export CONTEXT_PATH ALIAS_LOCATION CONTEXT_LOCATION PUBLIC_URL

find build -type f -print0 | xargs -0 sed -i -e "s/##PUBLIC_URL##/$PUBLIC_URL/g"

envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" <nginx.tmpl >/etc/nginx/nginx.conf

exec nginx -g 'daemon off;'