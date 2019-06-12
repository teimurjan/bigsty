from sqlalchemy.orm import sessionmaker

from src.repos.base import Repo
from src.models.intl import Language


class LanguageRepo(Repo):
    def filter_by(self, **kwargs):
        with self.session_scope() as s:
            return s.query(Language).filter(Language.name == kwargs['name']).all()
