from api.middleware.http.authorize import AuthorizeHttpMiddleware
from api.factories.services.user import UserServiceFactory


class AuthorizeHttpMiddlewareFactory:
    @staticmethod
    def create():
        user_service = UserServiceFactory.create()
        return AuthorizeHttpMiddleware(user_service=user_service)
