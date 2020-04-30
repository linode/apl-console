
#!/bin/sh

export CONTEXT_PATH=${CONTEXT_PATH:-}
ALIAS_LOCATION=''
CONTEXT_LOCATION=''
if [ $CONTEXT_PATH != "" ]; then
  ALIAS_LOCATION="alias /app/build;"
  CONTEXT_LOCATION="@$CONTEXT_PATH"
fi

export CONTEXT_PATH ALIAS_LOCATION CONTEXT_LOCATION

envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" <nginx.tmpl >/etc/nginx/nginx.conf

exec nginx -g 'daemon off;'