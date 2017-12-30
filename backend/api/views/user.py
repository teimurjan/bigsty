from api.factories.services import ServiceType
from api.utils.form_fields import NAME_FIELD, PASSWORD_FIELD, GROUP_FIELD, EMAIL_FIELD
from api.utils.validator import REQUIRED, EMPTY, MAX_LENGTH, REGEX, IS_EMAIL
from api.views.base import DetailView, ListView


class UserListView(ListView):
  auth_rules = {
    'GET': ['manager', 'admin'],
    'POST': ['manager', 'admin'],
  }

  def __init__(self, **kwargs):
    super().__init__(ServiceType.USERS, 'users.', **kwargs)
    self.validation_rules = {
      NAME_FIELD: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30},
      EMAIL_FIELD: {REQUIRED: True, IS_EMAIL: True},
      PASSWORD_FIELD: {REQUIRED: True, REGEX: r'^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$'},
      GROUP_FIELD: {REQUIRED: True, EMPTY: False}
    }


class UserView(DetailView):
  auth_rules = {
    'GET': ['manager', 'admin'],
    'PUT': ['manager', 'admin'],
    'DELETE': ['manager', 'admin'],
  }

  def __init__(self, **kwargs):
    super().__init__(ServiceType.USER, 'user.', **kwargs)
    self.validation_rules = {
      NAME_FIELD: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30},
      PASSWORD_FIELD: {REQUIRED: True, REGEX: r'[A-Za-z0-9@#$%^&+=]{8,}'},
      GROUP_FIELD: {REQUIRED: True, EMPTY: False}
    }
