from src.repos.language import LanguageRepo
from src.services.language import LanguageService


class LanguageServiceFactory:
    @staticmethod
    def create(db_conn):
        repo = LanguageRepo(db_conn)
        return LanguageService(repo=repo)
