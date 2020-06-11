#!/usr/bin/env bash

BIN_NAME=$(basename "$0")
COMMAND_NAME=$1
SUB_COMMAND_NAME=$2

sub_help () {
    echo "Usage: $BIN_NAME <command>"
    echo
    echo "Commands:"
    echo "   help               This help message"
    echo "   up                 Start standalone docker-compose version of web (add '-d' to daemonize)"
    echo "   up-api             Start docker-compose version of web with api as dep (add '-d' to daemonize)"
    echo "   down               Stop and clean docker-compose containers"
    echo "   logs               Show logs of daemonized containers (add '-f' to follow)"
    echo "   e2e                Run e2e tests in docker-compose"
}

sub_up () {
    docker-compose -f docker-compose.yml up $1
}
sub_up-api () {
    docker-compose -f docker-compose.yml -f docker-compose-with-api.yml up $1
}

sub_down () {
    docker-compose -f docker-compose.yml -f docker-compose-with-api.yml down --remove-orphans
}

sub_logs () {
    docker-compose -f docker-compose.yml -f docker-compose-with-api.yml logs $1
}

sub_e2e () {
    docker-compose -f docker-compose-with-api.yml -f docker-compose-e2e.yml up --exit-code-from e2e
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