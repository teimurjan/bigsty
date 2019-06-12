from src.api import API

from src.factories.middlewares.http.authorize import AuthorizeHttpMiddlewareFactory
from src.factories.middlewares.http.language import LanguageHttpMiddlewareFactory


class APIFactory:
    def __init__(self, app, db_conn):
        self.__app = app
        self.__db_conn = db_conn

    def create(self):
        middlewares = [
            AuthorizeHttpMiddlewareFactory.create(self.__db_conn),
            LanguageHttpMiddlewareFactory.create(self.__db_conn)
        ]
        return API(self.__app, self.__db_conn, middlewares)
