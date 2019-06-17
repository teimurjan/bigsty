from src.repos.base import Repo
from src.models import Language


class LanguageRepo(Repo):
    def __init__(self, db_conn):
        super().__init__(db_conn, Language)

    @Repo.with_session
    def filter_by_name(self, name: str, session):
        return session.query(Language).filter(Language.name == name).all()

    class DoesNotExist(Exception):
        pass