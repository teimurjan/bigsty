from api.factories.services import ServiceType
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
      'name': {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30},
      'email': {REQUIRED: True, IS_EMAIL: True},
      'password': {REQUIRED: True, REGEX: r'^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$'},
      'group': {REQUIRED: True, EMPTY: False}
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
      'name': {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30},
      'password': {REQUIRED: True, REGEX: r'[A-Za-z0-9@#$%^&+=]{8,}'},
      'group': {REQUIRED: True, EMPTY: False}
    }
