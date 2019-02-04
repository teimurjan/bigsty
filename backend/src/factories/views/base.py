from abc import abstractmethod


class ViewFactory:
    def __init__(self, db_conn):
        self._db_conn = db_conn

    @abstractmethod
    def create(self, http_method=None):
        raise NotImplementedError()
