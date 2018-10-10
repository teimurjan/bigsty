from api.factories.services.user import UserServiceFactory
from api.factories.validators.authentication import AuthenticationValidatorFactory
from api.factories.views.base import ViewFactory
from api.views.authentication import AuthenticationView


class AuthenticationViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        user_service = UserServiceFactory.create()
        validator = AuthenticationValidatorFactory.create()
        return AuthenticationView(
            validator=validator,
            user_service=user_service,
        )
