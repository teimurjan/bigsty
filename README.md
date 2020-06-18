# eye8

[Eye8](https://eye8.kg) - is a modern sunglasses online store built with [ReactJS](https://reactjs.org/) and [Flask](https://flask.palletsprojects.com/en/1.1.x/). As the search engine [Elasticsearch](https://www.elastic.co/) is used.

## Dependencies
The application is completely dockerized so you'll need to install [Docker](https://docs.docker.com/engine/installation/).

## Local Development
Clone [eye8-web](https://github.com/teimurjan/eye8-web) and [eye8-backend](https://github.com/teimurjan/eye8-backend) into the root folder:
```sh
git clone git@github.com:teimurjan/eye8-web.git web
git clone git@github.com:teimurjan/eye8-backend.git backend
```


Create docker-compose.development.yml based on [the example file](./docker-compose.development.example.yml) and run:
```sh
docker-compose -f docker-compose.development.yml up -d    
```

## Run web outside the container
MacOS has performance problems when running web inside container. In order to prevent it, you should stop web container:
```sh
docker-compose -f docker-compose.development.yml stop web
```

Then you should install [npm](https://www.npmjs.com), [yarn](https://yarnpkg.com/), [nvm](https://github.com/nvm-sh/nvm), [yvm](https://yvm.js.org/docs/overview). After that execute the following commands inside [web directory](./web).
```sh
nvm use && yvm use
yarn
env SERVER_API_URL=http://backend:5000 CLIENT_API_URL=http://localhost:5000 yarn dev
```
