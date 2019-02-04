from src.api import API


class APIFactory:
    def __init__(self, app, db_conn):
        self.__app = app
        self.__db_conn = db_conn

    def create(self):
        return API(self.__app, self.__db_conn)
