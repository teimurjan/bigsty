from src.middleware.http.authorize import AuthorizeHttpMiddleware
from src.factories.services.user import UserServiceFactory


class AuthorizeHttpMiddlewareFactory:
    @staticmethod
    def create():
        user_service = UserServiceFactory.create()
        return AuthorizeHttpMiddleware(user_service=user_service)
