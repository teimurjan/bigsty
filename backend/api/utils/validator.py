from string import Formatter

from cerberus import Validator
from cerberus.errors import BasicErrorHandler
from django.core.exceptions import ValidationError

SCHEMA = 'schema'

REQUIRED = 'required'
EMPTY = 'empty'
NULL = 'nullable'
MIN_LENGTH = 'minlength'
MAX_LENGTH = 'maxlength'
REGEX = 'regex'
MAX_VALUE = 'max'
MIN_VALUE = 'min'
IS_EMAIL = 'is_email'
BETWEEN = 'between'
TYPE = 'type'

TYPE_CODE = 0x24
REQUIRED_CODE = 0x02
EMPTY_CODE = 0x22
NULL_CODE = 0x23
MIN_LENGTH_CODE = 0x27
MAX_LENGTH_CODE = 0x28
REGEX_CODE = 0x41
MIN_CODE = 0x42
MAX_CODE = 0x43


class CaseableFormatter(Formatter):
  def convert_field(self, value, conversion):
    if conversion == 'c':
      return value.capitalize()
    if conversion == 'l':
      return value.lowercase()
    if conversion == 'u':
      return value.uppercase()
    else:
      return super().convert_field(value, conversion)


class ErrorHandler(BasicErrorHandler):
  def __init__(self, prefix=None, tree=None):
    super(ErrorHandler, self).__init__(tree)
    self.prefix = prefix
    self.custom_messages = {
      REQUIRED_CODE: "errors.{prefix}{field}.required",
      EMPTY_CODE: "errors.{prefix}{field}.mustNotBeEmpty",
      NULL_CODE: "errors.{prefix}{field}.mustNotBeNull",
      TYPE_CODE: "errors.{prefix}{field}.mustBe{constraint!c}",
      MIN_LENGTH_CODE: "errors.{prefix}{field}.minLength",
      MAX_LENGTH_CODE: "errors.{prefix}{field}.maxLength",
      REGEX_CODE: "errors.{prefix}{field}.regex",
      MIN_CODE: "errors.{prefix}{field}.min",
      MAX_CODE: "errors.{prefix}{field}.max"
    }
    self.formatter = CaseableFormatter()

  def format_message(self, field, error):
    error_code = self.custom_messages.get(error.code) or self.messages.get(error.code)
    return self.formatter.format(error_code, *error.info, constraint=error.constraint, field='.'.join(error.document_path),
                                 value=error.value, prefix=self.prefix)


class SchemaValidator(Validator):
  def _validate_is_email(self, is_email: bool, field, value):
    from django.core.validators import validate_email
    try:
      validate_email(value)
    except ValidationError:
      self._error(field, 'errors.{prefix}{field}.isEmail'.format(prefix=self.error_handler.prefix, field=field))

  def _validate_between(self, between: tuple, field, value):
    if value < between[0] or value > between[1]:
      self._error(field, 'errors.{prefix}{field}.between'.format(prefix=self.error_handler.prefix, field=field))
