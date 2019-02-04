from src.middleware.http.language import LanguageHttpMiddleware
from src.factories.services.user import UserServiceFactory
from src.repos.language import LanguageRepo

class LanguageHttpMiddlewareFactory:
    @staticmethod
    def create():
        language_repo = LanguageRepo()
        return LanguageHttpMiddleware(language_repo=language_repo)
