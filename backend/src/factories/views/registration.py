from src.factories.services.user import UserServiceFactory
from src.factories.validators.registration import RegistrationValidatorFactory
from src.factories.views.base import ViewFactory
from src.views.registration import RegistrationView


class RegistrationViewFactory(ViewFactory):
    def create(self, http_method=None):
        user_service = UserServiceFactory.create(self._db_conn)
        validator = RegistrationValidatorFactory.create()
        return RegistrationView(
            validator=validator,
            user_service=user_service,
        )
