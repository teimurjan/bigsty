from django.urls import reverse

from api.models import User, Group
from api.tests.views.base.base_list_view_test import ListViewTestCase
from api.utils.errors.error_constants import GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg

from api.utils.http_constants import FORBIDDEN_CODE


def get_user_data(name=None, email=None, password=None, group=None):
  return {'name': name, 'email': email, 'password': password, 'group': group}


list_url = reverse('users')


class UserListViewTest(ListViewTestCase):
  def test_should_get_succeed(self):
    self.should_get_all_succeed(list_url, User, token=self.admin_user_token)

  def test_should_get_require_role(self):
    response = self.send_get_request(list_url, self.reader_user_token)
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_get_with_filter_succeed(self):
    url = '{0}?group__in=["manager"]'.format(list_url)
    self.should_get_succeed_with_filter(url, User, {'group__in': ['manager']}, token=self.manager_user_token)

  def test_should_get_with_exclude_succeed(self):
    url = '{0}?exclude=["email"]'.format(list_url)
    self.should_get_succeed_with_exclude(url, User, exclude=['email'], token=self.manager_user_token)

  def test_should_get_with_serialized_field_succeed(self):
    url = '{0}?serialize=["group"]'.format(list_url)
    self.should_get_succeed_with_serialize(url, User, serialize=['group'], token=self.manager_user_token)

  def test_should_post_succeed(self):
    data = get_user_data('Tim', 'teymur@email.com', 'Passw0rd', 'reader')
    expected = data.copy()
    del expected['password']
    self.should_post_succeed(list_url, data, self.admin_user_token, expected)

  def test_should_post_require_auth(self):
    self.should_post_require_auth(list_url)

  def test_should_post_require_role(self):
    self.should_post_require_role(list_url, self.reader_user_token)

  def test_should_post_null_values(self):
    data = get_user_data()
    expected_content = {
      'name': ['errors.users.name.mustNotBeNull'],
      'email': ['errors.users.email.mustNotBeNull'],
      'password': ['errors.users.password.mustNotBeNull'],
      'group': ['errors.users.group.mustNotBeNull']
    }
    self.should_post_fail(list_url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_empty_values(self):
    data = get_user_data('', '', '', '')
    expected_content = {
      'name': ['errors.users.name.mustNotBeEmpty'],
      'email': ['errors.users.email.isEmail'],
      'password': ['errors.users.password.regex'],
      'group': ['errors.users.group.mustNotBeEmpty']
    }
    self.should_post_fail(list_url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_invalid_values(self):
    data = get_user_data('Name', 'wrong email', 'wrong password', 'reader')
    expected_content = {
      'email': ['errors.users.email.isEmail'],
      'password': ['errors.users.password.regex'],
    }
    self.should_post_fail(list_url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_invalid_group(self):
    data = get_user_data('Name', 'teymur@email.com', 'Passw0rd', 'invalid group')
    expected_content = {
      GLOBAL_ERR_KEY: [get_not_exist_msg(Group)],
    }
    self.should_post_fail(list_url, data=data, expected_content=expected_content, token=self.admin_user_token)
