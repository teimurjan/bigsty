import abc

from django.core.exceptions import ValidationError
from django.core.validators import validate_email as validate_email_format

from api.utils.error_constants import *
from api.utils.form_fields_constants import NAME_FIELD, EMAIL_FIELD, PASSWORD_FIELD
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

  def has_errors(self):
    for field_name in self.errors:
      if len(self.errors[field_name]) > 0:
        return True
    return False


class RegistrationFormValidator(Validator):
  def __init__(self, data):
    self.name = data[NAME_FIELD]
    self.email = data[EMAIL_FIELD]
    self.password = data[PASSWORD_FIELD]
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


class LoginFormValidator(Validator):
  def __init__(self, data):
    self.email = data[EMAIL_FIELD]
    self.password = data[PASSWORD_FIELD]
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


class ProductFormValidator(Validator):
  def __init__(self, data):
    self.name = data['name']
    self.description = data['description']
    self.price = data['price']
    self.category = data['category']
    self.image = data['image']
    self.discount = data['discount']
    self.quantity = data['quantity']
    self.errors = {
      'name': [],
      'image': [],
      'price': [],
      'category': [],
      'description': [],
      'discount': [],
      'quantity': [],
    }

  def validate(self):
    self.errors['name'] = validate_name(self.name)
    self._validate_image()
    self._validate_price()
    self._validate_category()
    self._validate_description()
    self._validate_discount()
    self._validate_quantity()

  def _validate_image(self):
    if not self.image:
      self.errors['image'].append(NO_IMAGE_ERR)

  def _validate_price(self):
    if not self.price:
      self.errors['price'].append(NO_PRICE_ERR)
    else:
      try:
        if int(self.price) < 0:
          self.errors['price'].append(PRICE_VALUE_ERR)
      except ValueError:
        self.errors['price'].append(PRICE_NOT_INT_ERR)

  def _validate_category(self):
    if not self.category:
      self.errors['category'].append(NO_CATEGORY_ERR)
    else:
      try:
        Category.objects.get(pk=self.category)
      except Category.DoesNotExist:
        self.errors['category'].append(NO_SUCH_CATEGORY_ERR)

  def _validate_description(self):
    if not self.description:
      self.errors['description'].append(NO_DESCRIPTION_ERR)

  def _validate_quantity(self):
    if not self.quantity:
      self.errors['quantity'].append(NO_QUANTITY_ERR)
    else:
      try:
        if int(self.quantity) < 0:
          self.errors['quantity'].append(QUANTITY_VALUE_ERR)
      except ValueError:
        self.errors['quantity'].append(QUANTITY_NOT_INT_ERR)

  def _validate_discount(self):
    if not self.discount:
      self.errors['discount'].append(NO_DISCOUNT_ERR)
    else:
      try:
        discount = int(self.discount)
        max_discount = 100
        min_discount = 0
        if discount >= max_discount or discount < min_discount:
          self.errors['discount'].append(DISCOUNT_VALUE_ERR)
      except ValueError:
        self.errors['discount'].append(DISCOUNT_NOT_INT_ERR)


class CategoryFormValidator(Validator):
  def __init__(self, data):
    self.name = data[NAME_FIELD]
    self.errors = {
      'name': []
    }

  def validate(self):
    self.errors['name'] = validate_name(self.name)
