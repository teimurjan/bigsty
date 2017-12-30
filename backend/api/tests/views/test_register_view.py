import json
import re

import jwt
from django.core import mail
from django.urls import reverse

from api.tests.views.base.base_view_test import ViewTestCase
from api.utils.errors.error_constants import SAME_EMAIL_ERR
from api.utils.form_fields import EMAIL_FIELD, PASSWORD_FIELD, NAME_FIELD, ACCESS_TOKEN_KEY, GROUP_FIELD, ID_FIELD
from api.utils.http_constants import OK_CODE, BAD_REQUEST_CODE
from main.settings import SECRET_KEY


def get_data(name=None, email=None, password=None):
  return {NAME_FIELD: name, EMAIL_FIELD: email, PASSWORD_FIELD: password}


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
    response = self.client.get(confirm_url)
    self.assertEquals(response.status_code, OK_CODE)
    token = json.loads(response.content.decode())[ACCESS_TOKEN_KEY]
    decoded_token = jwt.decode(token, SECRET_KEY)
    self.assertEquals(decoded_token[NAME_FIELD], data[NAME_FIELD])
    self.assertEquals(decoded_token[GROUP_FIELD], 'reader')

  def test_should_post_existing_user(self):
    data = get_data('Existing user', 'reader@user.com', 'Passw0rd')
    response = self.send_post_request(register_url, data)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    response_data = json.loads(response.content.decode())
    errors = response_data[EMAIL_FIELD]
    self.assertEquals(errors, [SAME_EMAIL_ERR])

  def test_should_post_invalid_values(self):
    data = get_data('Existing user', 'invalid', 'invalid')
    response = self.send_post_request(register_url, data)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[EMAIL_FIELD], ['errors.registration.email.isEmail'])
    self.assertEquals(data[PASSWORD_FIELD], ['errors.registration.password.regex'])

  def test_should_post_no_data(self):
    response = self.send_post_request(register_url, get_data())
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[NAME_FIELD], ['errors.registration.name.mustNotBeNull'])
    self.assertEquals(data[EMAIL_FIELD], ['errors.registration.email.mustNotBeNull'])
    self.assertEquals(data[PASSWORD_FIELD], ['errors.registration.password.mustNotBeNull'])

  def test_should_complete_registration_for_not_existing_user(self):
    payload = {ID_FIELD: 999}
    token = jwt.encode(payload, SECRET_KEY).decode()
    url = '/api/register?token={0}'.format(token)
    response = self.client.get(url)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    err = json.loads(response.content.decode())['global']
    self.assertEquals(err, ['errors.completeRegistration.invalidToken'])

  def test_should_complete_registration_with_invalid_token_format(self):
    url = '/api/register?token={0}'.format('invalid token')
    response = self.client.get(url)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    err = json.loads(response.content.decode())['global']
    self.assertEquals(err, ['errors.completeRegistration.invalidToken'])

  def test_should_complete_registration_without_token(self):
    url = '/api/register'
    response = self.client.get(url)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    err = json.loads(response.content.decode())['global']
    self.assertEquals(err, ['errors.completeRegistration.invalidToken'])

  def test_should_complete_registration_for_active_user(self):
    payload = {ID_FIELD: self.reader_user.pk}
    token = jwt.encode(payload, SECRET_KEY).decode()
    url = '/api/register?token={0}'.format(token)
    response = self.client.get(url)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    err = json.loads(response.content.decode())['global']
    self.assertEquals(err, ['errors.completeRegistration.alreadyActive'])
