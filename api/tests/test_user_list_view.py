import json

from django.test import TestCase

from api.models import User
from api.serializers import generate_token
from api.tests.constants import USER_LIST_URL
from api.utils.form_fields_constants import NAME_FIELD, EMAIL_FIELD
from api.utils.response_constants import DATA_JSON_KEY, GROUP_JSON_KEY


class UserListViewTest(TestCase):
  fixtures = ["user_list_view_test.json"]

  def setUp(self):
    user = User.objects.get(pk=2)
    self.token = generate_token(user)

  def test_success(self):
    response = self.client.get(USER_LIST_URL, HTTP_AUTHORIZATION='Bearer %s' % self.token)
    data = json.loads(response.content.decode())
    users = data[DATA_JSON_KEY]
    self.assertEquals(len(users), 3)
    first_user = users[0]
    second_user = users[1]
    third_user = users[2]
    self.assertEquals(first_user[GROUP_JSON_KEY], 'reader')
    self.assertEquals(second_user[GROUP_JSON_KEY], 'admin')
    self.assertEquals(third_user[GROUP_JSON_KEY], 'reader')
    self.assertEquals(first_user[NAME_FIELD], 'Test User 1')
    self.assertEquals(second_user[NAME_FIELD], 'Test User 2')
    self.assertEquals(third_user[NAME_FIELD], 'Test User 3')
    self.assertEquals(first_user[EMAIL_FIELD], "test1@test.test")
    self.assertEquals(second_user[EMAIL_FIELD], "test2@test.test")
    self.assertEquals(third_user[EMAIL_FIELD], "test3@test.test")
