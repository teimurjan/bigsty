import json

from django.test import TestCase

from api.models import User, Group
from api.serializers import generate_token
from api.tests.views.constants import USER_LIST_URL, TEST_NAME, VALID_PASSWORD, INVALID_FORMAT_PASSWORD, INVALID_EMAIL_FORMAT
from api.utils.errors.error_constants import SAME_EMAIL_ERR, NOT_VALID_EMAIL_ERR, NOT_VALID_PASSWORD_ERR, GLOBAL_ERR_KEY
from api.utils.form_fields_constants import NAME_FIELD, EMAIL_FIELD, PASSWORD_FIELD, GROUP_FIELD, DATA_KEY, ID_FIELD, \
  GROUP_FIELD
from api.utils.response_constants import FORBIDDEN_CODE, OK_CODE, BAD_REQUEST_CODE, NOT_FOUND_CODE
from api.utils.errors.error_messages import get_not_exist_msg, get_field_empty_msg


def get_user_dict(name=None, email=None, password=None, group_id=None):
  return {NAME_FIELD: name, EMAIL_FIELD: email, PASSWORD_FIELD: password, GROUP_FIELD: group_id}


VALID_EMAIL = 'test@test.test'


class UserListViewTest(TestCase):
  fixtures = ['user_list_view_test.json']

  def setUp(self):
    user = User.objects.get(pk=2)
    self.token = generate_token(user)

  def send_post_request(self, user_dict, token):
    return self.client.post(USER_LIST_URL,
                            data=json.dumps(user_dict),
                            HTTP_AUTHORIZATION='Bearer %s' % token,
                            content_type='application/json')

  def test_should_get_success(self):
    response = self.client.get(USER_LIST_URL, HTTP_AUTHORIZATION='Bearer %s' % self.token)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())
    users = data[DATA_KEY]
    users_in_db = User.objects.all()
    self.assertEquals(len(users), len(users_in_db))
    self.assertEquals(users[0], users_in_db[0].to_dict())

  def test_should_throw_get_admin_required(self):
    response = self.client.get(USER_LIST_URL, HTTP_AUTHORIZATION='invalid')
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_post_success(self):
    user_dict = get_user_dict(name=TEST_NAME,
                              email=VALID_EMAIL,
                              password=VALID_PASSWORD,
                              group_id=1)
    response = self.send_post_request(user_dict, self.token)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEquals(data[NAME_FIELD], user_dict[NAME_FIELD])
    self.assertEquals(data[EMAIL_FIELD], user_dict[EMAIL_FIELD])
    self.assertEquals(data[GROUP_FIELD], user_dict[GROUP_FIELD])

  def test_should_post_admin_required(self):
    user_dict = get_user_dict(name=TEST_NAME,
                              email=VALID_EMAIL,
                              password=VALID_PASSWORD,
                              group_id=1)
    response = self.send_post_request(user_dict, 'Invalid')
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_throw_post_user_with_email_exists(self):
    user_dict = get_user_dict(email=User.objects.all()[0].email,
                              name=TEST_NAME,
                              password=VALID_PASSWORD,
                              group_id=1)
    response = self.send_post_request(user_dict, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[EMAIL_FIELD][0], SAME_EMAIL_ERR)

  def test_should_throw_post_invalid_email_format(self):
    user_dict = get_user_dict(email=INVALID_EMAIL_FORMAT,
                              name=TEST_NAME,
                              password=VALID_PASSWORD,
                              group_id=1)
    response = self.send_post_request(user_dict, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[EMAIL_FIELD][0], NOT_VALID_EMAIL_ERR)

  def test_should_throw_post_invalid_password_format(self):
    user_dict = get_user_dict(name=TEST_NAME,
                              email=VALID_EMAIL,
                              password=INVALID_FORMAT_PASSWORD,
                              group_id=1)
    response = self.send_post_request(user_dict, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[PASSWORD_FIELD][0], NOT_VALID_PASSWORD_ERR)

  def test_should_throw_post_invalid_group_id(self):
    user_dict = get_user_dict(name=TEST_NAME,
                              email=VALID_EMAIL,
                              password=VALID_PASSWORD,
                              group_id=4)
    response = self.send_post_request(user_dict, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], get_not_exist_msg(Group))

  def test_should_throw_post_no_values(self):
    response = self.send_post_request({}, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[NAME_FIELD][0], get_field_empty_msg(NAME_FIELD))
    self.assertEquals(data[EMAIL_FIELD][0], get_field_empty_msg(EMAIL_FIELD))
    self.assertEquals(data[PASSWORD_FIELD][0], get_field_empty_msg(PASSWORD_FIELD))
    self.assertEquals(data[GROUP_FIELD][0], get_field_empty_msg(GROUP_FIELD))
