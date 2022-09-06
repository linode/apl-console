# Otomi Console

The frontend of the Otomi Container Platform that communicates with [otomi-api](https://github.com/redkubes/otomi-api).

[Otomi Core](https://github.com/redkubes/otomi-core) is the platform that houses the console, and feeds it all the data it needs to start using it.

## Development

### Setting up environment

Copy `.env.sample` to `.env` and edit accordingly.

### Start the dependencies

It is expected to have `$ENV_DIR` pointing to a valid values repo. Please follow the instructions in [otomi-core's readme]() if you need to create one.

#### Locally

Just clone `otomi-core` somewhere, run `npm install` and start the tools server with `npm run server`.

#### In docker-compose

```
bin/dc.sh up-deps
```

### Run the api server

```
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

The console uses a client generated with `@reduxjs/toolkit` which needs to be updated whenever OpenApi schema is changed. Just run `npm run gen:store` when the api is running on `http://localhost:8080` (the default options for `npm run dev`).

## Custom schema decorators

**x-nullMe** - the properie with this decorator are not rendered and thier values are set to `null` on form submit.
Notice that the otomi-api schema must define a given property as nullable in order make ik compatible with this decorator.
