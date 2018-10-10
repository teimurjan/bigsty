from api.models import Language
from api.repos.base import Repo


class LanguageRepo(Repo):
    def __init__(self):
        super().__init__(Language)
