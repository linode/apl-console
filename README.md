# Otomi Stack Web

The frontend of the Otomi Container Platform. Communicates with [otomi-stack-api](https://github.com/redkubes/otomi-stack-api).

## Development

### Setup environment

1. Download .secrets file from Google Drive (<https://drive.google.com/drive/folders/0AGwuKvXYSqGIUk9PVA>) to root directory of this project.

2. Copy `.env.sample` to `.env.dev` and edit accordingly.

```
. ./.secrets && . ./.env.dev
```

3. Setup access to GitHub packages

```
. ./.secrets && echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> ~/.npmrc
```

### Running in docker-compose with all deps

```

bin/dc.sh up-all

```

### Running with only deps in docker-compose

```
bin/dc.sh up-deps &
npm run dev
```
