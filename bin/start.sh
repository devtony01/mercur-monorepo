#!/bin/sh

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ".env does not exist. Copying from .env.example..."
    cp ".env.example" ".env"
    echo ".env created from .env.example."
fi

export DOCKER_CLIENT_TIMEOUT=600
export COMPOSE_HTTP_TIMEOUT=600

echo 'You can start services independently'
echo './bin/start.sh postgres redis medusa storefront vendor-panel'

docker compose up --build "$@"