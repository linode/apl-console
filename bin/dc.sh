#!/usr/bin/env bash
source .env
BIN_NAME=$(basename "$0")
COMMAND_NAME=$1

info="(add '-d' to daemonize, or 'logs' for logs on pre-daemonized stack)"
sub_help () {
    echo "Usage: $BIN_NAME <command>"
    echo
    echo "Commands:"
    echo "   help               This help message"
    echo "   up                 Start standalone docker-compose version of web without dependent services $info"
    echo "   up-all             Start docker-compose version of web with dependent services $info"
    echo "   up-deps            Start docker-compose version of only dependent services $info"
    echo "   down               Stop and clean docker-compose containers"
    echo "   e2e                Run e2e tests in docker-compose against running dev server"
    echo "   e2e-ci             Run e2e tests in docker-compose in CI"
}

sub_up () {
    c="docker-compose -f docker-compose.yml"
    $c pull && $c up $1
}

sub_up-all () {
    c="docker-compose -f docker-compose.yml -f docker-compose-deps.yml -f docker-compose-all.yml"
    $c pull && $c up $1
}

sub_up-deps () {
    c="docker-compose -f docker-compose-deps.yml -f docker-compose-ce.yml"
    $c pull && $c up $1
}

sub_down () {
    c="docker-compose -f docker-compose.yml -f docker-compose-deps.yml -f docker-compose-ce.yml"
    $c down --remove-orphans -v
}

case $COMMAND_NAME in
    "" | "-h" | "--help")
        sub_help
        ;;
    *)
        shift
        sub_${COMMAND_NAME} $@
        if [ $? = 127 ]; then
            echo "'$COMMAND_NAME' is not a known command or has errors." >&2
            sub_help
            exit 1
        fi
        ;;
esac

:
