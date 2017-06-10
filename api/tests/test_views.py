import json

from django.test import TestCase

from api.utils.error_constants import NO_SUCH_USER_ERR, NOT_VALID_EMAIL_ERR, \
  PASSWORD_DOESNT_MATCH_ERR
from api.utils.form_fields_constants import EMAIL_FIELD, PASSWORD_FIELD
from api.utils.response_constants import TOKEN_JSON_KEY


class LoginViewTest(TestCase):
  fixtures = ["login_test.json"]

  def send_request(self, email, password):
    url = '/api/login'
    return self.client.post(url, json.dumps(
      {
        EMAIL_FIELD: email,
        PASSWORD_FIELD: password
      }
    ), content_type='application/json')

  def test_success(self):
    response = self.send_request(email="test@test.test",
                                 password="testtest123")
    self.assertEquals(response.status_code, 200)
    data = json.loads(response.content.decode())
    self.assertIn(TOKEN_JSON_KEY, data)
    token = data[TOKEN_JSON_KEY]
    self.assertGreater(len(token), 0)

  def test_no_such_user(self):
    response = self.send_request(email="test1@test.test",
                                 password="testtest123")
    self.assertEquals(response.status_code, 404)
    data = json.loads(response.content.decode())
    self.assertIn(EMAIL_FIELD, data)
    email_errors = data[EMAIL_FIELD]
    self.assertEquals(email_errors[0], NO_SUCH_USER_ERR)

  def test_invalid_email_format(self):
    response = self.send_request(email="invalid",
                                 password="testtest123")
    self.assertEquals(response.status_code, 400)
    data = json.loads(response.content.decode())
    self.assertIn(EMAIL_FIELD, data)
    email_errors = data[EMAIL_FIELD]
    self.assertEquals(email_errors[0], NOT_VALID_EMAIL_ERR)

  def test_invalid_password(self):
    response = self.send_request(email="test@test.test",
                                 password="esttest123")
    self.assertEquals(response.status_code, 400)
    data = json.loads(response.content.decode())
    self.assertIn(PASSWORD_FIELD, data)
    email_errors = data[PASSWORD_FIELD]
    self.assertEquals(email_errors[0], PASSWORD_DOESNT_MATCH_ERR)
