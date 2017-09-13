from cerberus import Validator
from cerberus.errors import BasicErrorHandler
from django.core.exceptions import ValidationError

SCHEMA = 'schema'

REQUIRED = 'required'
EMPTY = 'empty'
NULL = 'nullable'
MIN_LENGTH = 'min_length'
MAX_LENGTH = 'max_length'
REGEX = 'regex'
MAX_VALUE = 'max'
MIN_VALUE = 'min'
IS_EMAIL = 'is_email'
BETWEEN = 'between'


class ErrorHandler(BasicErrorHandler):
  def __init__(self, prefix, tree=None):
    super(ErrorHandler, self).__init__(tree)
    self.prefix = prefix
    self.custom_messages = {
      0x02: "errors.{prefix}{field}.required",
      0x22: "errors.{prefix}{field}.mustNotBeEmpty",
      0x23: "errors.{prefix}{field}.mustNotBeNull",
      0x27: "errors.{prefix}{field}.minLength",
      0x28: "errors.{prefix}{field}.maxLength",
      0x41: "errors.{prefix}{field}.regex",
      0x42: "errors.{prefix}{field}.min",
      0x43: "errors.{prefix}{field}.max"
    }

  def format_message(self, field, error):
    try:
      error_code = self.custom_messages[error.code]
    except KeyError:
      error_code = self.messages[error.code]
    return error_code.format(
      *error.info, constraint=error.constraint,
      field=field, value=error.value, prefix=self.prefix)


class SchemaValidator(Validator):
  def _validate_is_email(self, is_email: bool, field, value):
    from django.core.validators import validate_email
    try:
      validate_email(value)
    except ValidationError:
      self._error(field, 'errors.{prefix}{field}.is_email'.format(prefix=self.error_handler.prefix, field=field))

  def _validate_between(self, between: tuple, field, value):
    if between[0] > len(value) > between[1]:
      self._error(field, 'errors.{prefix}{field}.between'.format(prefix=self.error_handler.prefix, field=field))
