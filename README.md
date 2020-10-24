# Otomi Console

The frontend of the Otomi Container Platform. Communicates with [otomi-stack-api](https://github.com/redkubes/otomi-stack-api).

## Development

### Setting up environment

1. Copy `.env.sample` to `.env` and edit accordingly.

2. Download `otomi-stack-api/.secrets` file from [Google Drive secrets](https://drive.google.com/drive/folders/1N802vs0IplKehkZq8SxMi67RipyO1pHN) and put contents in `.env`.

3. Setup access to GitHub packages:

```
source .env && echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> ~/.npmrc
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
