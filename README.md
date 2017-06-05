# Installation
#### Clone project
```sh
git clone https://github.com/teimurjan/online-store.git projects/online-store
cd ~/projects/online-store
```
#### Install global dependencies
* ##### [Yarn](https://yarnpkg.com/lang/en/docs/install/)
* ##### [Node](https://nodejs.org/en/download/)
* ##### [Python 3.5.2](https://www.python.org/downloads/release/python-352/)
#### Install backend dependencies
```sh
source virtualenv/bin/activate
pip install -r requirements.txt
```
* __Create database__
``` sh
    mysql -uusername -ppassword
    create database online_store;
    exit;
```
* __Make migrations__
``` sh
python3 manage.py makemigrations
python3 manage.py migrate
```
#### Install frontend dependencies
``` sh
cd store/frontend
yarn
```