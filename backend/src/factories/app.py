
import os
import logging

import sqlalchemy as db
from flask import Flask

from src.factories.api import APIFactory


class AppFactory:
    @staticmethod
    def create():
        app = Flask(__name__)
        app.config.from_object(os.environ.get('APP_SETTINGS'))

        engine = db.create_engine(app.config['DB_URL'], echo=True)
        connection = engine.connect()

        api = APIFactory(app, connection).create()

        return app
