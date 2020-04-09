from typing import TypeVar, Generic

from sqlalchemy.orm import sessionmaker
from contextlib import contextmanager

T = TypeVar('T')


def with_session(f):
    def wrapper(self, *args, **kwargs):
        if kwargs.get('session') is None:
            with self.session() as s:
                kwargs['session'] = s
                return f(self, *args, **kwargs)
        return f(self, *args, **kwargs)

    return wrapper


class Repo(Generic[T]):
    def __init__(self, db_conn, Model: T):
        self.__db_conn = db_conn
        self.__Model = Model

    @contextmanager
    def session(self):
        Session = sessionmaker(bind=self.__db_conn, expire_on_commit=False)
        session = Session()
        try:
            yield session
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()

    @with_session
    def get_by_id(self, id_, session) -> T:
        obj = session.query(self.__Model).get(id_)
        if obj is None:
            raise self.DoesNotExist()

        return obj

    @with_session
    def get_all(self, offset = None, limit = None, session=None):
        return session.query(self.__Model).order_by(self.__Model.id).offset(offset).limit(limit).all()
    
    @with_session
    def filter_by_ids(self, ids, session):
        return session.query(self.__Model).filter(self.__Model.id.in_(ids)).all()

    @with_session
    def delete(self, id_, session):
        obj = self.get_by_id(id_, session=session)
        return session.delete(obj)

    class DoesNotExist(Exception):
        def __new__(type, *args, **kwargs):
            raise NotImplementedError


class IntlRepo(Repo):
    def _set_intl_texts(self, texts, owner, owner_field_name, IntlTextModel):
        new_texts = []
        for language_id, value in texts.items():
            text = IntlTextModel()
            text.value = value
            text.language_id = int(language_id)
            new_texts.append(text)

        setattr(owner, owner_field_name, new_texts)
        
