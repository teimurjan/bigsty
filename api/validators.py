import abc

from django.core.exceptions import ValidationError
from django.core.validators import validate_email as validate_email_format

from api.models import User, Category, Group, ProductType
from api.utils.errors.error_constants import NOT_VALID_EMAIL_ERR, NOT_VALID_PASSWORD_ERR, \
  PRICE_VALUE_ERR, PRICE_NOT_INT_ERR, QUANTITY_VALUE_ERR, QUANTITY_NOT_INT_ERR, DISCOUNT_VALUE_ERR, \
  DISCOUNT_NOT_INT_ERR, GLOBAL_ERR_KEY, SAME_EMAIL_ERR, SAME_CATEGORY_NAME_ERR, SAME_PRODUCT_TYPE_NAME_ERR, \
  INVALID_FEATURE_TYPE_ID_ERR, VALUE_LENGTH_ERR
from api.utils.errors.error_messages import get_not_exist_msg, get_field_empty_msg
from api.utils.form_fields_constants import NAME_FIELD, EMAIL_FIELD, PASSWORD_FIELD, DISCOUNT_FIELD, QUANTITY_FIELD, \
  DESCRIPTION_FIELD, CATEGORY_FIELD, PRICE_FIELD, IMAGE_FIELD, GROUP_FIELD, GROUP_FIELD, FEATURE_TYPES_FIELD, \
  SHORT_DESCRIPTION_FIELD, FEATURE_VALUES_FIELD


def validate_email(email):
  errors = []
  try:
    validate_email_format(email)
  except ValidationError:
    errors.append(NOT_VALID_EMAIL_ERR)
  return errors


def validate_password(password):
  errors = []
  import re
  password_regex = r'[A-Za-z0-9@#$%^&+=]{8,}'
  if not re.match(password_regex, password):
    errors.append(NOT_VALID_PASSWORD_ERR)
  return errors


def validate_model_existence(model, model_id):
  errors = []
  try:
    model.objects.get(pk=model_id)
  except model.DoesNotExist:
    errors.append(get_not_exist_msg(model))
  return errors


def validate_length(field_name, value, min_length, max_length):
  if len(value) < min_length or len(value) > max_length:
    return [VALUE_LENGTH_ERR % (field_name.capitalize(), min_length, max_length)]
  return []


class Validator:
  def __init__(self, fields, data):
    self.fields = fields
    self.data = data
    self.errors = self.get_initial_errors()

  def get_initial_errors(self):
    errors = {k: [] for k in self.fields}
    errors[GLOBAL_ERR_KEY] = []
    return errors

  def _validate_data_integrity(self):
    for field in self.fields:
      try:
        if self.data[field] is None:
          self.errors[field].append(get_field_empty_msg(field))
      except KeyError:
        self.errors[field].append(get_field_empty_msg(field))

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
    super().__init__(
      [NAME_FIELD,
       EMAIL_FIELD,
       PASSWORD_FIELD], data
    )

  def validate(self):
    self._validate_data_integrity()
    if self.has_errors():
      return
    self.errors[NAME_FIELD] = validate_length(NAME_FIELD, self.data[NAME_FIELD], 1, 30)
    self.errors[EMAIL_FIELD] = validate_email(self.data[EMAIL_FIELD])
    self.errors[PASSWORD_FIELD] = validate_password(self.data[PASSWORD_FIELD])


class LoginFormValidator(Validator):
  def __init__(self, data):
    super().__init__([EMAIL_FIELD, PASSWORD_FIELD], data)

  def validate(self):
    self._validate_data_integrity()
    if self.has_errors():
      return
    self.errors[EMAIL_FIELD] = validate_email(self.data[EMAIL_FIELD])
    self.errors[PASSWORD_FIELD] = validate_password(self.data[PASSWORD_FIELD])


class UserCreationFormValidator(Validator):
  def __init__(self, data):
    super().__init__(
      [NAME_FIELD,
       EMAIL_FIELD,
       PASSWORD_FIELD,
       GROUP_FIELD], data
    )

  def validate(self):
    self._validate_data_integrity()
    if self.has_errors():
      return
    self.errors[NAME_FIELD] = validate_length(NAME_FIELD, self.data[NAME_FIELD], 1, 30)
    self.errors[EMAIL_FIELD] = validate_email(self.data[EMAIL_FIELD])
    self.errors[PASSWORD_FIELD] = validate_password(self.data[PASSWORD_FIELD])


class UserUpdateFormValidator(Validator):
  def __init__(self, data):
    super().__init__(
      [NAME_FIELD,
       PASSWORD_FIELD,
       GROUP_FIELD], data
    )

  def validate(self):
    self._validate_data_integrity()
    if self.has_errors():
      return
    self.errors[NAME_FIELD] = validate_length(NAME_FIELD, self.data[NAME_FIELD], 1, 30)
    self.errors[PASSWORD_FIELD] = validate_password(self.data[PASSWORD_FIELD])


class ProductFormValidator(Validator):
  def __init__(self, data):
    super().__init__(
      [NAME_FIELD,
       IMAGE_FIELD,
       PRICE_FIELD,
       CATEGORY_FIELD,
       DESCRIPTION_FIELD,
       DISCOUNT_FIELD,
       QUANTITY_FIELD], data
    )

  def validate(self):
    self._validate_data_integrity()
    if self.has_errors():
      return
    self._validate_price()
    self._validate_category()
    self._validate_discount()
    self._validate_quantity()

  def _validate_price(self):
    try:
      if int(self.data[PRICE_FIELD]) < 0:
        self.errors[PRICE_FIELD].append(PRICE_VALUE_ERR)
    except ValueError:
      self.errors[PRICE_FIELD].append(PRICE_NOT_INT_ERR)

  def _validate_category(self):
    try:
      Category.objects.get(pk=self.data[Category])
    except Category.DoesNotExist:
      self.errors[CATEGORY_FIELD].append(get_not_exist_msg(Category))

  def _validate_quantity(self):
    try:
      if int(self.data[QUANTITY_FIELD]) < 0:
        self.errors[QUANTITY_FIELD].append(QUANTITY_VALUE_ERR)
    except ValueError:
      self.errors[QUANTITY_FIELD].append(QUANTITY_NOT_INT_ERR)

  def _validate_discount(self):
    try:
      discount = int(self.data[DISCOUNT_FIELD])
      max_discount = 100
      min_discount = 0
      if discount >= max_discount or discount < min_discount:
        self.errors[DISCOUNT_FIELD].append(DISCOUNT_VALUE_ERR)
    except ValueError:
      self.errors[DISCOUNT_FIELD].append(DISCOUNT_NOT_INT_ERR)


class CategoryFormValidator(Validator):
  def __init__(self, data):
    super().__init__([
      NAME_FIELD,
      FEATURE_TYPES_FIELD
    ], data)

  def validate(self):
    self._validate_data_integrity()
    if self.has_errors():
      return
    self.errors[NAME_FIELD] = validate_length(NAME_FIELD, self.data[NAME_FIELD], 1, 30)


class ProductTypeFormValidator(Validator):
  def __init__(self, data):
    super().__init__([
      NAME_FIELD,
      DESCRIPTION_FIELD,
      SHORT_DESCRIPTION_FIELD,
      FEATURE_VALUES_FIELD,
      CATEGORY_FIELD,
      IMAGE_FIELD
    ], data)

  def validate(self):
    self._validate_data_integrity()
    if self.has_errors():
      return
    self.errors[NAME_FIELD] = validate_length(NAME_FIELD, self.data[NAME_FIELD], 1, 30)
    self.errors[DESCRIPTION_FIELD] = validate_length(DESCRIPTION_FIELD, self.data[DESCRIPTION_FIELD], 1, 1000)
    self.errors[SHORT_DESCRIPTION_FIELD] = validate_length(SHORT_DESCRIPTION_FIELD,
                                                           self.data[SHORT_DESCRIPTION_FIELD], 1, 100)


