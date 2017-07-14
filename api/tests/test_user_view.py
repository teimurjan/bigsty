import json

from django.test import TestCase

from api.models import User, Group
from api.serializers import generate_token
from api.tests.constants import USER_LIST_URL, INVALID_FORMAT_PASSWORD, VALID_PASSWORD
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, NOT_VALID_PASSWORD_ERR
from api.utils.form_fields_constants import NAME_FIELD, PASSWORD_FIELD, GROUP_FIELD, DATA_KEY, EMAIL_FIELD, ID_FIELD, \
  GROUP_FIELD
from api.utils.response_constants import OK_CODE, FORBIDDEN_CODE, NOT_FOUND_CODE, BAD_REQUEST_CODE
from api.utils.errors.error_messages import get_not_exist_msg, get_field_empty_msg

NEW_NAME = "New name"


def url(user_id):
  return '%s/%s' % (USER_LIST_URL, user_id)


def get_user_dict(name, password, group_id):
  return {NAME_FIELD: name, PASSWORD_FIELD: password, GROUP_FIELD: group_id}


class UserViewTest(TestCase):
  fixtures = ["user_view_test.json"]

  def send_put_request(self, user_id, data_dict, token=None):
    return self.client.put(url(user_id),
                           data=json.dumps(data_dict),
                           HTTP_AUTHORIZATION='Bearer %s' % token,
                           content_type="application/json")

  def setUp(self):
    user = User.objects.get(pk=2)
    self.token = generate_token(user)

  # GET
  def test_should_get_success(self):
    user_id = 1
    response = self.client.get(url(user_id), HTTP_AUTHORIZATION='Bearer %s' % self.token)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    user = User.objects.get(pk=1)
    self.assertEquals(user.pk, data[ID_FIELD])
    self.assertEquals(user.name, data[NAME_FIELD])
    self.assertEquals(user.group.id, data[GROUP_FIELD])
    self.assertEquals(user.email, data[EMAIL_FIELD])

  def test_should_get_not_found(self):
    user_id = 10
    response = self.client.get(url(user_id), HTTP_AUTHORIZATION='Bearer %s' % self.token)
    self.assertEquals(response.status_code, NOT_FOUND_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], get_not_exist_msg(User))

  def test_should_get_admin_required(self):
    user_id = 1
    response = self.client.get(url(user_id), HTTP_AUTHORIZATION='invalid')
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  # PUT
  def test_should_update_success(self):
    user_id = 1
    user_dict = get_user_dict(name=NEW_NAME,
                              password=VALID_PASSWORD,
                              group_id=3)
    response = self.send_put_request(user_id=user_id, data_dict=user_dict, token=self.token)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEquals(data[NAME_FIELD], user_dict[NAME_FIELD])
    self.assertEquals(data[GROUP_FIELD], user_dict[GROUP_FIELD])

  def test_should_throw_update_no_user_with_id(self):
    user_id = 10
    user_dict = get_user_dict(name=NEW_NAME,
                              password=VALID_PASSWORD,
                              group_id=3)
    response = self.send_put_request(user_id=user_id, data_dict=user_dict, token=self.token)
    self.assertEquals(response.status_code, NOT_FOUND_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], get_not_exist_msg(User))

  def test_should_throw_invalid_password_format(self):
    user_id = 1
    user_dict = get_user_dict(name=NEW_NAME,
                              password=INVALID_FORMAT_PASSWORD,
                              group_id=3)
    response = self.send_put_request(user_id=user_id, data_dict=user_dict, token=self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[PASSWORD_FIELD][0], NOT_VALID_PASSWORD_ERR)

  def test_should_throw_no_group_with_id(self):
    user_id = 1
    user_dict = get_user_dict(name=NEW_NAME,
                              password=VALID_PASSWORD,
                              group_id=22)
    response = self.send_put_request(user_id=user_id, data_dict=user_dict, token=self.token)
    self.assertEquals(response.status_code, NOT_FOUND_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], get_not_exist_msg(Group))

  def test_should_throw_update_no_values(self):
    user_id = 1
    response = self.send_put_request(user_id=user_id, data_dict={}, token=self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GROUP_FIELD][0], get_field_empty_msg(GROUP_FIELD))
    self.assertEquals(data[NAME_FIELD][0], get_field_empty_msg(NAME_FIELD))
    self.assertEquals(data[PASSWORD_FIELD][0], get_field_empty_msg(PASSWORD_FIELD))

  def test_should_throw_update_admin_required(self):
    user_id = 1
    user_dict = get_user_dict(name=NEW_NAME,
                              password=VALID_PASSWORD,
                              group_id=3)
    response = self.send_put_request(user_id=user_id, data_dict=user_dict)
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  # DELETE
  def test_should_delete_success(self):
    user_id = 1
    response = self.client.delete(url(user_id), HTTP_AUTHORIZATION='Bearer %s' % self.token)
    self.assertEquals(response.status_code, OK_CODE)

  def test_should_throw_delete_no_user_with_id(self):
    user_id = 12
    response = self.client.delete(url(user_id), HTTP_AUTHORIZATION='Bearer %s' % self.token)
    self.assertEquals(response.status_code, NOT_FOUND_CODE)

  def test_should_throw_delete_admin_required(self):
    user_id = 1
    response = self.client.delete(url(user_id), HTTP_AUTHORIZATION='invalid')
    self.assertEquals(response.status_code, FORBIDDEN_CODE)
