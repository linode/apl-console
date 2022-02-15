# Otomi Console

The frontend of the Otomi Container Platform that communicates with [otomi-api](https://github.com/redkubes/otomi-api).

[Otomi Core](https://github.com/redkubes/otomi-core) is the platform that houses the console, and feeds it all the data it needs to start using it.

## Development

### Setting up environment

1. Copy `.env.sample` to `.env` and edit accordingly.

2. Setup access to GitHub packages:

```
source .env && echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> ~/.npmrc
```

### Start the dependencies

It is expected to have `$ENV_DIR` pointing to a valid values repo. Please follow the instructions in [otomi-core's readme]() if you need to create one.

#### Locally

Just clone `otomi-core` somewhere, run `npm install` and start the tools server with `otomi server`.

#### In docker-compose

```
bin/dc.sh up-deps &
npm run dev
```

### Debugging

Run chrome with remote debugger plugin enabled, e.g.:

```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

Run react app in development mode

```
npm run dev
```

In vscode: open `Run and Debug` window, select `Attach to Chrome and run debugging`

### Api client

The otomi-console uses `@redkubes/otomi-api-client-axios` package that is released whenever OpenApi schema is changed. For development purpose you can link local npm package:

```
npm link @redkubes/otomi-api-client-axios
```
