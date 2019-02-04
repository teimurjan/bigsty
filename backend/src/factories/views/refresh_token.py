from src.factories.views.base import ViewFactory
from src.factories.validators.refresh_token import RefreshTokenValidatorFactory
from src.factories.services.user import UserServiceFactory
from src.views.refresh_token import RefreshTokenView

class RefreshTokenViewFactory(ViewFactory):
    def create(self, http_method=None):
        user_service = UserServiceFactory.create(self._db_conn)
        validator = RefreshTokenValidatorFactory.create()
        return RefreshTokenView(
            validator=validator,
            user_service=user_service,
        )

        