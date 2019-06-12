from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager

class Repo:
    def __init__(self, db_conn):
        self._db_conn = db_conn

    @contextmanager
    def session_scope(self):
        Session = sessionmaker(bind=self._db_conn, expire_on_commit=False)
        session = Session()
        try:
            yield session
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()

    class DoesNotExist(Exception):
        pass