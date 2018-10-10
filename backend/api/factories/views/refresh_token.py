from api.factories.views.base import ViewFactory
from api.factories.validators.refresh_token import RefreshTokenValidatorFactory
from api.factories.services.user import UserServiceFactory
from api.views.refresh_token import RefreshTokenView

class RefreshTokenViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        user_service = UserServiceFactory.create()
        validator = RefreshTokenValidatorFactory.create()
        return RefreshTokenView(
            validator=validator,
            user_service=user_service,
        )

        