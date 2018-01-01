import json

import jwt
from django.urls import reverse

from api.tests.views.base.base_view_test import ViewTestCase
from api.utils.errors.error_constants import INVALID_EMAIL_OR_PASSWORD_ERR, GLOBAL_ERR_KEY
from api.utils.http_constants import OK_CODE, BAD_REQUEST_CODE
from main.settings import SECRET_KEY

url = reverse('login')


def get_data(email=None, password=None):
  return {'email': email, 'password': password}


class LoginViewTest(ViewTestCase):
  def test_should_post_succeed(self):
    data = get_data(self.reader_user.email, 'Passw0rd')
    response = self.send_post_request(url, data)
    self.assertEquals(response.status_code, OK_CODE)
    token = json.loads(response.content.decode())['access_token']
    decoded_token = jwt.decode(token, SECRET_KEY)
    self.assertEquals(decoded_token['name'], self.reader_user.name)
    self.assertEquals(decoded_token['group'], self.reader_user.group_id)

  def test_should_post_empty_values(self):
    data = get_data('', '')
    response = self.send_post_request(url, data)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data['email'], ['errors.login.email.mustNotBeEmpty'])
    self.assertEquals(data['password'], ['errors.login.password.mustNotBeEmpty'])

  def test_should_post_null_values(self):
    data = get_data()
    response = self.send_post_request(url, data)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data['email'], ['errors.login.email.mustNotBeNull'])
    self.assertEquals(data['password'], ['errors.login.password.mustNotBeNull'])

  def test_should_post_no_data(self):
    response = self.send_post_request(url)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY], 'Invalid JSON format')

  def test_should_post_invalid_email(self):
    data = get_data('invalid', 'Passw0rd')
    response = self.send_post_request(url, data)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data['auth'], [INVALID_EMAIL_OR_PASSWORD_ERR])

  def test_should_post_invalid_password(self):
    data = get_data(self.reader_user.email, 'passw0rd')
    response = self.send_post_request(url, data)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data['auth'], [INVALID_EMAIL_OR_PASSWORD_ERR])
