from src.factories.services.user import UserServiceFactory
from src.factories.validators.authentication import AuthenticationValidatorFactory
from src.factories.views.base import ViewFactory
from src.views.authentication import AuthenticationView


class AuthenticationViewFactory(ViewFactory):
    def create(self, http_method=None):
        user_service = UserServiceFactory.create(self._db_conn)
        validator = AuthenticationValidatorFactory.create()
        return AuthenticationView(
            validator=validator,
            user_service=user_service,
        )
