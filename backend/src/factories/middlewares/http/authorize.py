from src.middleware.http.authorize import AuthorizeHttpMiddleware
from src.factories.services.user import UserServiceFactory


class AuthorizeHttpMiddlewareFactory:
    @staticmethod
    def create(db_conn):
        user_service = UserServiceFactory.create(db_conn)
        return AuthorizeHttpMiddleware(user_service=user_service)
