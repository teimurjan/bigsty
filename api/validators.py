import abc

from django.core.exceptions import ValidationError
from django.core.validators import validate_email as validate_email_format

from api.models import User, Category, Group
from api.utils.errors.error_constants import NOT_VALID_EMAIL_ERR, NOT_VALID_PASSWORD_ERR, \
  PRICE_VALUE_ERR, PRICE_NOT_INT_ERR, QUANTITY_VALUE_ERR, QUANTITY_NOT_INT_ERR, DISCOUNT_VALUE_ERR, \
  DISCOUNT_NOT_INT_ERR, GLOBAL_ERR_KEY, SAME_EMAIL_ERR, SAME_CATEGORY_NAME_ERR
from api.utils.errors.error_messages import get_not_exist_msg, get_field_empty_msg
from api.utils.form_fields_constants import NAME_FIELD, EMAIL_FIELD, PASSWORD_FIELD, DISCOUNT_FIELD, QUANTITY_FIELD, \
  DESCRIPTION_FIELD, CATEGORY_FIELD, PRICE_FIELD, IMAGE_FIELD, GROUP_FIELD, GROUP_FIELD, FEATURE_TYPES_FIELD


def validate_email(email):
  errors = []
  if not email:
    errors.append(get_field_empty_msg(EMAIL_FIELD))
  else:
    try:
      validate_email_format(email)
    except ValidationError:
      errors.append(NOT_VALID_EMAIL_ERR)
  return errors


def validate_password(password):
  errors = []
  if not password:
    errors.append(get_field_empty_msg(PASSWORD_FIELD))
  else:
    import re
    password_regex = r'[A-Za-z0-9@#$%^&+=]{8,}'
    if not re.match(password_regex, password):
      errors.append(NOT_VALID_PASSWORD_ERR)
  return errors


def validate_name(name):
  errors = []
  if not name:
    errors.append(get_field_empty_msg(NAME_FIELD))
  return errors


def validate_model_existence(model, model_id):
  errors = []
  try:
    model.objects.get(pk=model_id)
  except model.DoesNotExist:
    errors.append(get_not_exist_msg(model))
  return errors


class Validator:
  def __init__(self, errors):
    self.errors = errors

  @abc.abstractmethod
  def validate_post(self):
    return

  def has_errors(self):
    for field_name in self.errors:
      if len(self.errors[field_name]) > 0:
        return True
    return False


class RegistrationFormValidator(Validator):
  def __init__(self, data):
    super().__init__({
      NAME_FIELD: [],
      EMAIL_FIELD: [],
      PASSWORD_FIELD: [],
      GLOBAL_ERR_KEY: []
    })
    self.name = data.get(NAME_FIELD)
    self.email = data.get(EMAIL_FIELD)
    self.password = data.get(PASSWORD_FIELD)

  def validate_post(self):
    self.errors[EMAIL_FIELD] = validate_email(self.email)
    if User.objects.filter(email=self.email).exists():
      self.errors[EMAIL_FIELD].append(SAME_EMAIL_ERR)
    self.errors[PASSWORD_FIELD] = validate_password(self.password)
    self.errors[NAME_FIELD] = validate_name(self.name)


class LoginFormValidator(Validator):
  def __init__(self, data):
    super().__init__({
      EMAIL_FIELD: [],
      PASSWORD_FIELD: [],
      GLOBAL_ERR_KEY: []
    })
    self.email = data.get(EMAIL_FIELD)
    self.password = data.get(PASSWORD_FIELD)

  def validate_post(self):
    self.errors[EMAIL_FIELD] = validate_email(self.email)
    self.errors[PASSWORD_FIELD] = validate_password(self.password)


class UserFormValidator(Validator):
  def __init__(self, data):
    super().__init__({
      NAME_FIELD: [],
      EMAIL_FIELD: [],
      PASSWORD_FIELD: [],
      GROUP_FIELD: [],
      GLOBAL_ERR_KEY: []
    })
    self.name = data.get(NAME_FIELD)
    self.email = data.get(EMAIL_FIELD)
    self.password = data.get(PASSWORD_FIELD)
    self.group_id = data.get(GROUP_FIELD)

  def validate_post(self):
    self.errors[EMAIL_FIELD] = validate_email(self.email)
    if User.objects.filter(email=self.email).exists():
      self.errors[EMAIL_FIELD].append(SAME_EMAIL_ERR)
    self.errors[PASSWORD_FIELD] = validate_password(self.password)
    self.errors[NAME_FIELD] = validate_name(self.name)
    self._validate_group()

  def validate_put(self):
    self.errors[PASSWORD_FIELD] = validate_password(self.password)
    self.errors[NAME_FIELD] = validate_name(self.name)
    self._validate_group()

  def _validate_group(self):
    if self.group_id:
      self.errors[GROUP_FIELD] = validate_model_existence(Group, self.group_id)
    else:
      self.errors[GROUP_FIELD].append(get_field_empty_msg(GROUP_FIELD))


class ProductFormValidator(Validator):
  def __init__(self, data):
    super().__init__({
      NAME_FIELD: [],
      IMAGE_FIELD: [],
      PRICE_FIELD: [],
      CATEGORY_FIELD: [],
      DESCRIPTION_FIELD: [],
      DISCOUNT_FIELD: [],
      QUANTITY_FIELD: [],
    })
    self.name = data[NAME_FIELD]
    self.description = data[DESCRIPTION_FIELD]
    self.price = data[PRICE_FIELD]
    self.category = data[CATEGORY_FIELD]
    self.image = data[IMAGE_FIELD]
    self.discount = data[DISCOUNT_FIELD]
    self.quantity = data[QUANTITY_FIELD]

  def validate_post(self):
    self.errors[NAME_FIELD] = validate_name(self.name)
    self._validate_image()
    self._validate_price()
    self._validate_category()
    self._validate_description()
    self._validate_discount()
    self._validate_quantity()

  def _validate_image(self):
    if not self.image:
      self.errors[IMAGE_FIELD].append(get_field_empty_msg(IMAGE_FIELD))

  def _validate_price(self):
    if not self.price:
      self.errors[PRICE_FIELD].append(get_field_empty_msg(PRICE_FIELD))
    else:
      try:
        if int(self.price) < 0:
          self.errors[PRICE_FIELD].append(PRICE_VALUE_ERR)
      except ValueError:
        self.errors[PRICE_FIELD].append(PRICE_NOT_INT_ERR)

  def _validate_category(self):
    if not self.category:
      self.errors[CATEGORY_FIELD].append(get_field_empty_msg(CATEGORY_FIELD))
    else:
      try:
        Category.objects.get(pk=self.category)
      except Category.DoesNotExist:
        self.errors[CATEGORY_FIELD].append(get_not_exist_msg(Category))

  def _validate_description(self):
    if not self.description:
      self.errors[DESCRIPTION_FIELD].append(get_field_empty_msg(DESCRIPTION_FIELD))

  def _validate_quantity(self):
    if not self.quantity:
      self.errors[QUANTITY_FIELD].append(get_field_empty_msg(QUANTITY_FIELD))
    else:
      try:
        if int(self.quantity) < 0:
          self.errors[QUANTITY_FIELD].append(QUANTITY_VALUE_ERR)
      except ValueError:
        self.errors[QUANTITY_FIELD].append(QUANTITY_NOT_INT_ERR)

  def _validate_discount(self):
    if not self.discount:
      self.errors[DISCOUNT_FIELD].append(get_field_empty_msg(DISCOUNT_FIELD))
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
    super().__init__({
      NAME_FIELD: [],
      FEATURE_TYPES_FIELD: []
    })
    self.name = data[NAME_FIELD]
    self.feature_types_ids = data[FEATURE_TYPES_FIELD]

  def validate_post(self):
    self.errors[NAME_FIELD] = validate_name(self.name)
    if Category.objects.filter(name=self.name).exists():
      self.errors[NAME_FIELD].append(SAME_CATEGORY_NAME_ERR)
    if not self.feature_types_ids:
      self.errors[FEATURE_TYPES_FIELD].append(get_field_empty_msg(FEATURE_TYPES_FIELD))


class FeatureFormValidator(Validator):
  def __init__(self, data):
    pass

  def validate_post(self):
    pass
