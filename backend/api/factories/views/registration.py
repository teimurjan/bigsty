from api.factories.services.user import UserServiceFactory
from api.factories.validators.registration import RegistrationValidatorFactory
from api.factories.views.base import ViewFactory
from api.views.registration import RegistrationView


class RegistrationViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        user_service = UserServiceFactory.create()
        validator = RegistrationValidatorFactory.create()
        return RegistrationView(
            validator=validator,
            user_service=user_service,
        )
