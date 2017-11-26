import json

import jwt

from api.tests.views.base.base_view_test import ViewTestCase
from api.tests.views.constants import LOGIN_URL
from api.utils.errors.error_constants import INVALID_EMAIL_OR_PASSWORD_ERR, GLOBAL_ERR_KEY
from api.utils.form_fields import EMAIL_FIELD, PASSWORD_FIELD, TOKEN_KEY, AUTH_FIELDS, NAME_FIELD, GROUP_FIELD
from api.utils.http_constants import OK_CODE, BAD_REQUEST_CODE
from main.settings import SECRET_KEY


def get_data(email=None, password=None):
  return {EMAIL_FIELD: email, PASSWORD_FIELD: password}


class LoginViewTest(ViewTestCase):
  def test_should_post_succeed(self):
    data = get_data(self.reader_user.email, 'Passw0rd')
    response = self.send_post_request(LOGIN_URL, data)
    self.assertEquals(response.status_code, OK_CODE)
    token = json.loads(response.content.decode())[TOKEN_KEY]
    decoded_token = jwt.decode(token, SECRET_KEY)
    self.assertEquals(decoded_token[NAME_FIELD], self.reader_user.name)
    self.assertEquals(decoded_token[GROUP_FIELD], self.reader_user.group_id)

  def test_should_post_empty_values(self):
    data = get_data('', '')
    response = self.send_post_request(LOGIN_URL, data)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[EMAIL_FIELD], ['errors.login.email.mustNotBeEmpty'])
    self.assertEquals(data[PASSWORD_FIELD], ['errors.login.password.mustNotBeEmpty'])

  def test_should_post_null_values(self):
    data = get_data()
    response = self.send_post_request(LOGIN_URL, data)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[EMAIL_FIELD], ['errors.login.email.mustNotBeNull'])
    self.assertEquals(data[PASSWORD_FIELD], ['errors.login.password.mustNotBeNull'])

  def test_should_post_no_data(self):
    response = self.send_post_request(LOGIN_URL)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY], 'Invalid JSON format')

  def test_should_post_invalid_email(self):
    data = get_data('invalid', 'Passw0rd')
    response = self.send_post_request(LOGIN_URL, data)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[AUTH_FIELDS], [INVALID_EMAIL_OR_PASSWORD_ERR])

  def test_should_post_invalid_password(self):
    data = get_data(self.reader_user.email, 'passw0rd')
    response = self.send_post_request(LOGIN_URL, data)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[AUTH_FIELDS], [INVALID_EMAIL_OR_PASSWORD_ERR])
