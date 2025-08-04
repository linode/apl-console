# =============================================================================
#   PROJECT:   otomi-console (React + TypeScript)
#   USAGE:     make <target> [PM=npm]
# =============================================================================

# —–– Configurable —––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
PM        ?= npm
RUN       = $(PM) run

# —–– Phony targets —––––––––––––––––––––––––––––––––––––––––––––––––––––––––
.PHONY: help install dev docker start start\:chrome test lint lint-fix \
        format format-fix build eject prepare commit commit-retry \
        lint-staged gen-store spellcheck release release-minor \
        typecheck watch-ts run-if-changed lang-server lang-export \
        lang-import clean

# —–– Help —–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
help: ## Show this help message
	@grep -E '^[a-zA-Z0-9_:-]+:.*?##' Makefile \
		| awk 'BEGIN {print "\nUsage:"} {split($$0,a,":"); printf "  make %-15s %s\n", a[1], a[2]}' \
		| sed 's/## //g'

# —–– Install dependencies –––––––––––––––––––––––––––––––––––––––––––––––––––
install: ## npm ci (clean install)
	$(PM) ci

# —–– Development —–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
dev: ## npm run dev (parallel start/watch)
	$(RUN) dev

docker: ## npm run dev:docker (dockerized dev)
	$(RUN) dev:docker

start: ## npm start (CRA dev server)
	$(RUN) start

start\:chrome: ## npm run start:chrome (open Chrome remote-debug)
	$(RUN) start:chrome

# —–– Testing & linting –––––––––––––––––––––––––––––––––––––––––––––––––––––
test: ## npm run test (once)
	$(RUN) test

lint: ## npm run lint (includes typecheck)
	$(RUN) lint

lint-fix: ## npm run lint:fix
	$(RUN) lint:fix

lint-staged: ## npm run lint-staged
	$(RUN) lint-staged

# —–– Formatting ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
format: ## npm run format (check)
	$(RUN) format

format-fix: ## npm run format:fix
	$(RUN) format:fix

# —–– Build & eject –––––––––––––––––––––––––––––––––––––––––––––––––––––––––
build: ## npm run build (production bundle)
	$(RUN) build

eject: ## npm run eject (CRA)
	$(RUN) eject

# —–– Codegen & utils ––––––––––––––––––––––––––––––––––––––––––––––––––––––
gen-store: ## npm run gen:store (RTK Query codegen)
	$(RUN) gen-store

spellcheck: ## npm run spellcheck (cspell)
	$(RUN) spellcheck

run-if-changed: ## npm run run-if-changed (watch package-lock.json)
	$(RUN) run-if-changed

# —–– Releases & commits ––––––––––––––––––––––––––––––––––––––––––––––––––––
prepare: ## npm run prepare (husky install)
	$(RUN) prepare

commit: ## npm run cz (commitizen)
	$(RUN) cz

commit-retry: ## npm run cz:retry
	$(RUN) cz:retry

release: ## npm run release (standard-version)
	$(RUN) release

release-minor: ## npm run release:bump:minor
	$(RUN) release:bump:minor

# —–– TypeScript —–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
typecheck: ## npm run types (tsc --noEmit)
	$(RUN) types

watch-ts: ## npm run watch:ts (tsc -w)
	$(RUN) watch:ts

# —–– Language server & exports –––––––––––––––––––––––––––––––––––––––––––––
lang-server: ## npm run lang:server
	$(RUN) lang:server

lang-export: ## npm run lang:export
	$(RUN) lang:export

lang-import: ## IMPORT=1 npm run lang:export
	$(RUN) lang:import

# —–– Clean up —–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
clean: ## remove node_modules & build artifacts
	rm -rf node_modules build
