from api.middleware.http.language import LanguageHttpMiddleware
from api.factories.services.user import UserServiceFactory
from api.repos.language import LanguageRepo

class LanguageHttpMiddlewareFactory:
    @staticmethod
    def create():
        language_repo = LanguageRepo()
        return LanguageHttpMiddleware(language_repo=language_repo)
