import abc

from django.core.exceptions import ValidationError
from django.core.validators import validate_email as validate_email_format

from api.utils.error_constants import NO_EMAIL_ERR, NOT_VALID_EMAIL_ERR, NO_PASSWORD_ERR, NOT_VALID_PASSWORD_ERR, \
  NO_NAME_ERR, NO_SUCH_USER_ERR, NO_IMAGE_ERR, NO_PRICE_ERR, PRICE_VALUE_ERR, PRICE_NOT_INT_ERR, NO_CATEGORY_ERR, \
  NO_SUCH_CATEGORY_ERR, NO_DESCRIPTION_ERR, NO_QUANTITY_ERR, QUANTITY_VALUE_ERR, QUANTITY_NOT_INT_ERR, NO_DISCOUNT_ERR, \
  DISCOUNT_VALUE_ERR, DISCOUNT_NOT_INT_ERR, GLOBAL_ERR_KEY
from api.utils.form_fields_constants import NAME_FIELD, EMAIL_FIELD, PASSWORD_FIELD, DISCOUNT_FIELD, QUANTITY_FIELD, \
  DESCRIPTION_FIELD, CATEGORY_FIELD, PRICE_FIELD, IMAGE_FIELD
from api.models import User, Category


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
      NAME_FIELD: [],
      EMAIL_FIELD: [],
      PASSWORD_FIELD: [],
      GLOBAL_ERR_KEY: []
    }

  def validate(self):
    self.errors[EMAIL_FIELD] = validate_email(self.email)
    self.errors[PASSWORD_FIELD] = validate_password(self.password)
    self.errors[NAME_FIELD] = validate_name(self.name)


class LoginFormValidator(Validator):
  def __init__(self, data):
    self.email = data[EMAIL_FIELD]
    self.password = data[PASSWORD_FIELD]
    self.errors = {
      EMAIL_FIELD: [],
      PASSWORD_FIELD: [],
      GLOBAL_ERR_KEY: []
    }

  def validate(self):
    self.errors[EMAIL_FIELD] = validate_email(self.email)
    self.errors[PASSWORD_FIELD] = validate_password(self.password)


class ProductFormValidator(Validator):
  def __init__(self, data):
    self.name = data[NAME_FIELD]
    self.description = data[DESCRIPTION_FIELD]
    self.price = data[PRICE_FIELD]
    self.category = data[CATEGORY_FIELD]
    self.image = data[IMAGE_FIELD]
    self.discount = data[DISCOUNT_FIELD]
    self.quantity = data[QUANTITY_FIELD]
    self.errors = {
      NAME_FIELD: [],
      IMAGE_FIELD: [],
      PRICE_FIELD: [],
      CATEGORY_FIELD: [],
      DESCRIPTION_FIELD: [],
      DISCOUNT_FIELD: [],
      QUANTITY_FIELD: [],
    }

  def validate(self):
    self.errors[NAME_FIELD] = validate_name(self.name)
    self._validate_image()
    self._validate_price()
    self._validate_category()
    self._validate_description()
    self._validate_discount()
    self._validate_quantity()

  def _validate_image(self):
    if not self.image:
      self.errors[IMAGE_FIELD].append(NO_IMAGE_ERR)

  def _validate_price(self):
    if not self.price:
      self.errors[PRICE_FIELD].append(NO_PRICE_ERR)
    else:
      try:
        if int(self.price) < 0:
          self.errors[PRICE_FIELD].append(PRICE_VALUE_ERR)
      except ValueError:
        self.errors[PRICE_FIELD].append(PRICE_NOT_INT_ERR)

  def _validate_category(self):
    if not self.category:
      self.errors[CATEGORY_FIELD].append(NO_CATEGORY_ERR)
    else:
      try:
        Category.objects.get(pk=self.category)
      except Category.DoesNotExist:
        self.errors[CATEGORY_FIELD].append(NO_SUCH_CATEGORY_ERR)

  def _validate_description(self):
    if not self.description:
      self.errors[DESCRIPTION_FIELD].append(NO_DESCRIPTION_ERR)

  def _validate_quantity(self):
    if not self.quantity:
      self.errors[QUANTITY_FIELD].append(NO_QUANTITY_ERR)
    else:
      try:
        if int(self.quantity) < 0:
          self.errors[QUANTITY_FIELD].append(QUANTITY_VALUE_ERR)
      except ValueError:
        self.errors[QUANTITY_FIELD].append(QUANTITY_NOT_INT_ERR)

  def _validate_discount(self):
    if not self.discount:
      self.errors[DISCOUNT_FIELD].append(NO_DISCOUNT_ERR)
    else:
      try:
        discount = int(self.discount)
        max_discount = 100
        min_discount = 0
        if discount >= max_discount or discount < min_discount:
          self.errors[DISCOUNT_FIELD].append(DISCOUNT_VALUE_ERR)
      except ValueError:
        self.errors[DISCOUNT_FIELD].append(DISCOUNT_NOT_INT_ERR)


class CategoryFormValidator(Validator):
  def __init__(self, data):
    self.name = data[NAME_FIELD]
    self.errors = {
      NAME_FIELD: []
    }

  def validate(self):
    self.errors[NAME_FIELD] = validate_name(self.name)
