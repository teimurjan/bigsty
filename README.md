# About
##### This project is a skeleton of an online store. It promises to be the tool which can be applied in any selling area.
* Backend developed using Django but with custom auth system and validations. 
* Frontend is developed using Typescript/React bundle with such technologies as: [Redux](https://redux.js.org/), [redux-observable](https://redux-observable.js.org/), [Immutable](https://facebook.github.io/immutable-js/docs/), [Storybook](https://storybook.js.org/) and [react-intl](https://github.com/yahoo/react-intl).
# Installation
#### Dependencies
* ##### [Yarn](https://yarnpkg.com/lang/en/docs/install/)
* ##### [Node](https://nodejs.org/en/download/)
* ##### [Python 3.6.3](https://www.python.org/downloads/release/python-363/)
* ##### [Docker](https://docs.docker.com/engine/installation/)
#### Install backend dependencies
```sh
cd backend
python3 -m venv virtualenv
source virtualenv/bin/activate
pip install -r requirements.txt
```
* __Create database container (from root folder)__
``` sh
docker-compose up -d
```
* __Run migrations__
``` sh
cd backend
python3 manage.py makemigrations
python3 manage.py migrate
```
#### Install frontend dependencies
``` sh
cd frontend
yarn
```
#### Develop
```sh 
python3 backend/manage.py runserver
cd frontend
yarn start
```

