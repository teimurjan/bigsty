import abc

from django.core.exceptions import ValidationError
from django.core.validators import validate_email as validate_email_format

from api.utils.error_constants import *
from store.models import User, Category


def validate_email(email):
  errors = []
  if not email:
    errors.append(NO_EMAIL_ERR)
  else:
    try:
      validate_email_format(email)
    except ValidationError:
      errors.append(NOT_VALID_EMAIL_ERR)
  return errors


def validate_password(password):
  errors = []
  if not password:
    errors.append(NO_PASSWORD_ERR)
  else:
    import re
    password_regex = r'[A-Za-z0-9@#$%^&+=]{8,}'
    if not re.match(password_regex, password):
      errors.append(NOT_VALID_PASSWORD_ERR)
  return errors


def validate_name(name):
  errors = []
  if not name:
    errors.append(NO_NAME_ERR)
  return errors


class Validator:
  @abc.abstractmethod
  def validate(self):
    return


class RegistrationFormValidator(Validator):
  def __init__(self, name, email, password):
    self.name = name
    self.email = email
    self.password = password
    self.errors = {
      'name': [],
      'email': [],
      'password': [],
      'global': []
    }

  def validate(self):
    self.errors['email'] = validate_email(self.email)
    self.errors['password'] = validate_password(self.password)
    self.errors['name'] = validate_name(self.name)

  def has_errors(self):
    for field_name in self.errors:
      if len(self.errors[field_name]) > 0:
        return True
    return False


class LoginFormValidator(Validator):
  def __init__(self, email, password):
    self.email = email
    self.password = password
    self.errors = {
      'email': [],
      'password': [],
      'global': []
    }

  def validate(self):
    self.errors['email'] = validate_email(self.email)
    try:
      User.objects.get(email=self.email)
    except User.DoesNotExist:
      self.errors['email'].append(NO_SUCH_USER_ERR)
    self.errors['password'] = validate_password(self.password)

  def has_errors(self):
    for field_name in self.errors:
      if len(self.errors[field_name]) > 0:
        return True
    return False


class ProductFormValidator(Validator):
  def __init__(self, name, main_image, price, category_id):
    self.name = name
    self.main_image = main_image
    self.price = price
    self.category_id = category_id
    self.errors = {
      'name': [],
      'main_image': [],
      'price': [],
      'category': []
    }

  def validate(self):
    self.errors['name'] = validate_name(self.name)
    self._validate_main_image()
    self._validate_price()
    self._validate_category()

  def _validate_main_image(self):
    if not self.main_image:
      self.errors['main_image'].append(NO_IMAGE_ERR)

  def _validate_price(self):
    if not self.price:
      self.errors['price'].append(NO_PRICE_ERR)
    else:
      try:
        int(self.price)
      except ValueError:
        self.errors['price'].append(PRICE_NOT_INT_ERR)

  def _validate_category(self):
    if not self.category_id:
      self.errors['category'].append(NO_CATEGORY_ERR)
    else:
      try:
        Category.objects.get(pk=self.category_id)
      except Category.DoesNotExist:
        self.errors['category'].append(NO_SUCH_CATEGORY_ERR)

  def has_errors(self):
    for field_name in self.errors:
      if len(self.errors[field_name]) > 0:
        return True
    return False
