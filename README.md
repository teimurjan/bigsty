# About
[Eye8](https://eye8.kg) - is a modern sunglasses online store built with [ReactJS](https://reactjs.org/) and [Flask](https://flask.palletsprojects.com/en/1.1.x/). As the search engine [Elasticsearch](https://www.elastic.co/) is used.

# Dependencies
The application is completely dockerized so you'll need to install [Docker](https://docs.docker.com/engine/installation/).

# Local Development
Create docker-compose.development.yml based on [the example file](/docker-compose.development.example.yml) and run:
```sh
docker-compose -f docker-compose.development.yml up -d    
```
