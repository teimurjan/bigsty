# About

BIGSTY - is an open-source API providing much functionality for online stores.

# Installation

- Install [Docker](https://docs.docker.com/engine/installation/)
- Create .env.development with the content like(suffix `development` may be any other you like)

```
DJANGO_SECRET=secret
DJANGO_DB_HOST=db
DJANGO_DB_PORT=5432
POSTGRES_PASSWORD=password
POSTGRES_USER=user
POSTGRES_DB=online-store
DB_HOST=localhost
DB_PORT=5432
```

- Run

```sh
ENV=development docker-compose up -d
```
