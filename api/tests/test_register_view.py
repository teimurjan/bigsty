import json

from django.test import TestCase

from api.models import User
from api.tests.constants import REGISTER_URL, TEST_NAME, VALID_PASSWORD, \
  INVALID_EMAIL_FORMAT, INVALID_FORMAT_PASSWORD
from api.utils.errors.error_constants import SAME_EMAIL_ERR, NOT_VALID_EMAIL_ERR, NOT_VALID_PASSWORD_ERR
from api.utils.form_fields_constants import EMAIL_FIELD, PASSWORD_FIELD, NAME_FIELD, TOKEN_KEY
from api.utils.response_constants import OK_CODE, BAD_REQUEST_CODE
from api.utils.errors.error_messages import get_field_empty_msg

VALID_NOT_EXISTING_EMAIL = "test1@test.test"


class RegisterViewTest(TestCase):
  fixtures = ['register_view_test.json']

  def send_request(self, name=None, email=None, password=None):
    return self.client.post(REGISTER_URL, json.dumps(
      {
        NAME_FIELD: name,
        EMAIL_FIELD: email,
        PASSWORD_FIELD: password
      }
    ), content_type='application/json')

  def test_should_post_success(self):
    response = self.send_request(name=TEST_NAME,
                                 email=VALID_NOT_EXISTING_EMAIL,
                                 password=VALID_PASSWORD)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(TOKEN_KEY, data)
    token = data[TOKEN_KEY]
    self.assertGreater(len(token), 0)

  def test_should_throw_user_exists(self):
    response = self.send_request(name=TEST_NAME,
                                 email=User.objects.all()[0].email,
                                 password=VALID_PASSWORD)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(EMAIL_FIELD, data)
    email_errors = data[EMAIL_FIELD]
    self.assertEquals(email_errors[0], SAME_EMAIL_ERR)

  def test_should_throw_invalid_email_format(self):
    response = self.send_request(name=TEST_NAME,
                                 email=INVALID_EMAIL_FORMAT,
                                 password=VALID_PASSWORD)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(EMAIL_FIELD, data)
    email_errors = data[EMAIL_FIELD]
    self.assertEquals(email_errors[0], NOT_VALID_EMAIL_ERR)

  def test_should_throw_invalid_password_format(self):
    response = self.send_request(name=TEST_NAME,
                                 email=VALID_NOT_EXISTING_EMAIL,
                                 password=INVALID_FORMAT_PASSWORD)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(PASSWORD_FIELD, data)
    password_errors = data[PASSWORD_FIELD]
    self.assertEquals(password_errors[0], NOT_VALID_PASSWORD_ERR)

  def test_should_throw_no_name(self):
    response = self.send_request(email=VALID_NOT_EXISTING_EMAIL,
                                 password=VALID_PASSWORD)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(NAME_FIELD, data)
    name_errors = data[NAME_FIELD]
    self.assertEquals(name_errors[0], get_field_empty_msg(NAME_FIELD))

  def test_should_throw_no_email(self):
    response = self.send_request(name=TEST_NAME,
                                 password=VALID_PASSWORD)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(EMAIL_FIELD, data)
    email_errors = data[EMAIL_FIELD]
    self.assertEquals(email_errors[0], get_field_empty_msg(EMAIL_FIELD))

  def test_should_throw_no_password(self):
    response = self.send_request(name=TEST_NAME,
                                 email=VALID_NOT_EXISTING_EMAIL)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(PASSWORD_FIELD, data)
    password_errors = data[PASSWORD_FIELD]
    self.assertEquals(password_errors[0], get_field_empty_msg(PASSWORD_FIELD))
