import json
import re

import jwt
from django.core import mail
from django.urls import reverse

from api.tests.views.base.base_view_test import ViewTestCase
from api.utils.errors.error_constants import SAME_EMAIL_ERR

from api.utils.http_constants import OK_CODE, BAD_REQUEST_CODE
from main.settings import SECRET_KEY


def get_data(name=None, email=None, password=None):
  return {'name': name, 'email': email, 'password': password}


register_url = reverse('register')


class RegisterViewTest(ViewTestCase):
  def test_should_post_succeed(self):
    email = 'teymur@email.com'
    data = get_data('Tim', email, 'Passw0rd')
    response = self.send_post_request(register_url, data)
    self.assertEquals(response.status_code, OK_CODE)
    sent_mail = mail.outbox[0]
    self.assertEquals(sent_mail.to, [email])
    pattern = re.compile('<a href=\"testserver/(?P<url>.*)\">.*<\/a>')
    match = pattern.match(sent_mail.body)
    confirm_url = '/api/{0}'.format(match.group('url'))
    response = self.send_get_request(confirm_url)
    self.assertEquals(response.status_code, OK_CODE)
    token = json.loads(response.content.decode())['access_token']
    decoded_token = jwt.decode(token, SECRET_KEY)
    self.assertEquals(decoded_token['name'], data['name'])
    self.assertEquals(decoded_token['group'], 'reader')

  def test_should_post_existing_user(self):
    data = get_data('Existing user', 'reader@user.com', 'Passw0rd')
    response = self.send_post_request(register_url, data)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    response_data = json.loads(response.content.decode())
    errors = response_data['email']
    self.assertEquals(errors, [SAME_EMAIL_ERR])

  def test_should_post_invalid_values(self):
    data = get_data('Existing user', 'invalid', 'invalid')
    response = self.send_post_request(register_url, data)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data['email'], ['errors.registration.email.isEmail'])
    self.assertEquals(data['password'], ['errors.registration.password.regex'])

  def test_should_post_no_data(self):
    response = self.send_post_request(register_url, get_data())
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data['name'], ['errors.registration.name.mustNotBeNull'])
    self.assertEquals(data['email'], ['errors.registration.email.mustNotBeNull'])
    self.assertEquals(data['password'], ['errors.registration.password.mustNotBeNull'])

  def test_should_complete_registration_for_not_existing_user(self):
    payload = {'id': 999}
    token = jwt.encode(payload, SECRET_KEY).decode()
    url = '/api/register?token={0}'.format(token)
    response = self.send_get_request(url)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    err = json.loads(response.content.decode())['global']
    self.assertEquals(err, ['errors.completeRegistration.invalidToken'])

  def test_should_complete_registration_with_invalid_token_format(self):
    url = '/api/register?token={0}'.format('invalid token')
    response = self.send_get_request(url)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    err = json.loads(response.content.decode())['global']
    self.assertEquals(err, ['errors.completeRegistration.invalidToken'])

  def test_should_complete_registration_without_token(self):
    url = '/api/register'
    response = self.send_get_request(url)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    err = json.loads(response.content.decode())['global']
    self.assertEquals(err, ['errors.completeRegistration.invalidToken'])

  def test_should_complete_registration_for_active_user(self):
    token = self.reader_user.generate_registration_token()
    url = '/api/register?token={0}'.format(token)
    response = self.send_get_request(url)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    err = json.loads(response.content.decode())['global']
    self.assertEquals(err, ['errors.completeRegistration.alreadyActive'])
