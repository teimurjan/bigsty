import json

from django.test import TestCase

from api.models import User
from api.tests.views.constants import VALID_PASSWORD, \
  NOT_MATCH_PASSWORD, INVALID_EMAIL_FORMAT, LOGIN_URL, INVALID_FORMAT_PASSWORD
from api.utils.errors.error_constants import INVALID_EMAIL_OR_PASSWORD_ERR
from api.utils.form_fields_constants import EMAIL_FIELD, PASSWORD_FIELD, TOKEN_KEY, AUTH_FIELDS
from api.utils.response_constants import OK_CODE, BAD_REQUEST_CODE

VALID_NOT_EXISTING_EMAIL = "test1@test.test"


class LoginViewTest(TestCase):
  fixtures = ["login_view_test.json"]

  def send_request(self, email=None, password=None):
    return self.client.post(LOGIN_URL, json.dumps(
      {
        EMAIL_FIELD: email,
        PASSWORD_FIELD: password
      }
    ), content_type='application/json')

  def test_should_post_success(self):
    response = self.send_request(email=User.objects.all()[0].email,
                                 password=VALID_PASSWORD)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(TOKEN_KEY, data)
    token = data[TOKEN_KEY]
    self.assertGreater(len(token), 0)

  def test_should_throw_no_such_user(self):
    response = self.send_request(email=VALID_NOT_EXISTING_EMAIL,
                                 password=VALID_PASSWORD)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(AUTH_FIELDS, data)
    email_errors = data[AUTH_FIELDS]
    self.assertEquals(email_errors[0], INVALID_EMAIL_OR_PASSWORD_ERR)

  def test_should_throw_invalid_email_format(self):
    response = self.send_request(email=INVALID_EMAIL_FORMAT, password=VALID_PASSWORD)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(EMAIL_FIELD, data)
    email_errors = data[EMAIL_FIELD]
    self.assertEquals(email_errors[0], 'errors.loginPage.email.is_email')

  def test_should_throw_invalid_password(self):
    response = self.send_request(email=User.objects.all()[0].email,
                                 password=NOT_MATCH_PASSWORD)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(AUTH_FIELDS, data)
    auth_errors = data[AUTH_FIELDS]
    self.assertEquals(auth_errors[0], INVALID_EMAIL_OR_PASSWORD_ERR)

  def test_should_throw_invalid_password_format(self):
    response = self.send_request(email=User.objects.all()[0].email,
                                 password=INVALID_FORMAT_PASSWORD)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(PASSWORD_FIELD, data)
    password_errors = data[PASSWORD_FIELD]
    self.assertEquals(password_errors[0], 'errors.loginPage.password.regex')

  def test_should_throw_no_values(self):
    response = self.send_request()
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertIn(PASSWORD_FIELD, data)
    self.assertEquals(data[PASSWORD_FIELD][0], 'errors.loginPage.password.mustNotBeNull')
    self.assertEquals(data[EMAIL_FIELD][0], 'errors.loginPage.email.mustNotBeNull')
