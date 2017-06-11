import json

from django.test import TestCase

from api.tests.constants import VALID_EXISTING_EMAIL, VALID_NOT_EXISTING_EMAIL, VALID_PASSWORD, \
  NOT_MATCH_PASSWORD, INVALID_EMAIL_FORMAT, LOGIN_URL, INVALID_PASSWORD_FORMAT
from api.utils.error_constants import NO_SUCH_USER_ERR, NOT_VALID_EMAIL_ERR, \
  PASSWORD_DOESNT_MATCH_ERR, NOT_VALID_PASSWORD_ERR, NO_EMAIL_ERR, NO_PASSWORD_ERR
from api.utils.form_fields_constants import EMAIL_FIELD, PASSWORD_FIELD
from api.utils.response_constants import TOKEN_JSON_KEY, OK_CODE, NOT_FOUND_CODE, BAD_REQUEST_CODE


class LoginViewTest(TestCase):
  fixtures = ["login_view_test.json"]

  def send_request(self, email=None, password=None):
    return self.client.post(LOGIN_URL, json.dumps(
      {
        EMAIL_FIELD: email,
        PASSWORD_FIELD: password
      }
    ), content_type='application/json')

  def test_success(self):
    response = self.send_request(email=VALID_EXISTING_EMAIL,
                                 password=VALID_PASSWORD)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(TOKEN_JSON_KEY, data)
    token = data[TOKEN_JSON_KEY]
    self.assertGreater(len(token), 0)

  def test_no_such_user(self):
    response = self.send_request(email=VALID_NOT_EXISTING_EMAIL,
                                 password=VALID_PASSWORD)
    self.assertEquals(response.status_code, NOT_FOUND_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(EMAIL_FIELD, data)
    email_errors = data[EMAIL_FIELD]
    self.assertEquals(email_errors[0], NO_SUCH_USER_ERR)

  def test_invalid_email_format(self):
    response = self.send_request(email=INVALID_EMAIL_FORMAT,
                                 password=VALID_PASSWORD)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(EMAIL_FIELD, data)
    email_errors = data[EMAIL_FIELD]
    self.assertEquals(email_errors[0], NOT_VALID_EMAIL_ERR)

  def test_invalid_password(self):
    response = self.send_request(email=VALID_EXISTING_EMAIL,
                                 password=NOT_MATCH_PASSWORD)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(PASSWORD_FIELD, data)
    password_errors = data[PASSWORD_FIELD]
    self.assertEquals(password_errors[0], PASSWORD_DOESNT_MATCH_ERR)

  def test_invalid_password_format(self):
    response = self.send_request(email=VALID_EXISTING_EMAIL,
                                 password=INVALID_PASSWORD_FORMAT)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(PASSWORD_FIELD, data)
    password_errors = data[PASSWORD_FIELD]
    self.assertEquals(password_errors[0], NOT_VALID_PASSWORD_ERR)

  def test_no_email(self):
    response = self.send_request(password=VALID_PASSWORD)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(EMAIL_FIELD, data)
    email_errors = data[EMAIL_FIELD]
    self.assertEquals(email_errors[0], NO_EMAIL_ERR)

  def test_no_password(self):
    response = self.send_request(email=VALID_EXISTING_EMAIL)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(PASSWORD_FIELD, data)
    password_errors = data[PASSWORD_FIELD]
    self.assertEquals(password_errors[0], NO_PASSWORD_ERR)

