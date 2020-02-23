#!/bin/sh
heroku container:push web --arg REACT_APP_SERVER_URL=https://bigsty.herokuapp.com/ --app bigsty-react
heroku container:release web --app bigsty-react