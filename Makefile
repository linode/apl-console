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

# —–– Testing & linting –––––––––––––––––––––––––––––––––––––––––––––––––––––
test: ## npm run test (once)
	$(RUN) test

lint: ## npm run lint (includes typecheck)
	$(RUN) lint

# —–– Build –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
build: ## npm run build (production bundle)
	$(RUN) build

# —–– Codegen & utils –––––––––––––––––––––––––––––––––––––––––––––––––––––––
gen-store: ## npm run gen:store (RTK Query codegen)
	$(RUN) gen-store

# —–– Clean up —–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
clean: ## remove node_modules & build artifacts
	rm -rf node_modules build
