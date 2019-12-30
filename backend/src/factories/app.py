
import logging
import os

import sqlalchemy as db
from flask import Flask, send_from_directory

from paths import APP_ROOT_PATH

from src.factories.api import APIFactory


class AppFactory:
    @staticmethod
    def create():
        app = Flask(__name__)
        app.config.from_object(os.environ.get('APP_SETTINGS'))
        engine = db.create_engine(app.config['DB_URL'], echo=True)
        connection = engine.connect()

        APIFactory(app, connection).create()

        @app.route('/media/<path:path>', methods=['GET'])
        def media_route(path):
            abs_media_path = os.path.join(APP_ROOT_PATH, 'media')
            abs_path = os.path.join(abs_media_path, path)
            if os.path.isfile(abs_path):
                return send_from_directory(abs_media_path, path)

            return '', 404

        return app
