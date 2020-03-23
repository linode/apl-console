#!/usr/bin/env bash
# This gist is correct (works with fast-forward merges) https://gist.github.com/sindresorhus/7996717
# Even if this one is more readable https://gist.github.com/stefansundin/82051ad2c8565999b914

function changed() {
  git diff --name-only HEAD@{2} HEAD | grep "^$1" >/dev/null 2>&1
}

if changed 'package.json'; then
  echo -ne '\n\e[31mWARNING:\e[m \e[33mThe package.json changed, running npm install.\e[m\n\n'
  npm install
fi

exit 0
