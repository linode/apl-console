# Otomi Stack Web

The frontend of the Otomi Container Platform. Communicates with [otomi-stack-api](https://github.com/redkubes/otomi-stack-api).

## Development

### Prerequisites

Copy `.env.sample` to `.env.dev` and the `otomi-stack-web/.secrets` file from company secrets storage.

```
. ./.secrets && . ./.env.dev
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
