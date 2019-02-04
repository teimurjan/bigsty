
import os

from flask import Flask


class AppFactory:
    @staticmethod
    def create():
        app = Flask(__name__)
        app.config.from_object(os.environ.get('APP_SETTINGS'))
        return app
