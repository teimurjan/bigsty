from src.middleware.http.language import LanguageHttpMiddleware
from src.factories.services.user import UserServiceFactory
from src.repos.language import LanguageRepo

class LanguageHttpMiddlewareFactory:
    @staticmethod
    def create(db_conn):
        language_repo = LanguageRepo(db_conn)
        return LanguageHttpMiddleware(language_repo=language_repo)
