from django.http import JsonResponse

from api.factories.services import ServiceFactory, ServiceType
from api.services import AuthService
from api.utils.validator import REQUIRED, EMPTY, IS_EMAIL, REGEX, MAX_LENGTH
from api.views.base import BaseView
from api.views.utils import validation_required


class LoginView(BaseView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.AUTH, 'login.', **kwargs)
    self.validation_rules = {
      'email': {REQUIRED: True, EMPTY: False},
      'password': {REQUIRED: True, EMPTY: False}
    }

  @validation_required
  def post(self, request) -> JsonResponse:
    service: AuthService = ServiceFactory.create(self.service_type, request=request)
    return service.login()


class RegistrationView(BaseView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.AUTH, 'registration.', **kwargs)
    self.validation_rules = {
      'name': {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30},
      'email': {REQUIRED: True, IS_EMAIL: True},
      'password': {REQUIRED: True, REGEX: r'[A-Za-z0-9@#$%^&+=]{8,}'}
    }

  def get(self, request) -> JsonResponse:
    service: AuthService = ServiceFactory.create(self.service_type, request=request)
    return service.complete_registration()

  @validation_required
  def post(self, request) -> JsonResponse:
    service: AuthService = ServiceFactory.create(self.service_type, request=request)
    return service.register()


class RefreshTokenView(BaseView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.AUTH, 'refreshToken.', **kwargs)
    self.validation_rules = {
      'refresh_token': {REQUIRED: True, EMPTY: False}
    }

  @validation_required
  def post(self, request) -> JsonResponse:
    service: AuthService = ServiceFactory.create(self.service_type, request=request)
    return service.refresh()

