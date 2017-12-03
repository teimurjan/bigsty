from api.models import User, Group
from api.tests.views.base.base_list_view_test import ListViewTestCase
from api.tests.views.constants import USER_LIST_URL
from api.utils.errors.error_constants import GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields import NAME_FIELD, EMAIL_FIELD, PASSWORD_FIELD, GROUP_FIELD
from api.utils.http_constants import FORBIDDEN_CODE


def get_user_dict(name=None, email=None, password=None, group_id=None):
  return {NAME_FIELD: name, EMAIL_FIELD: email, PASSWORD_FIELD: password, GROUP_FIELD: group_id}


def get_user_data(name=None, email=None, password=None, group=None):
  return {NAME_FIELD: name, EMAIL_FIELD: email, PASSWORD_FIELD: password, GROUP_FIELD: group}


class UserListViewTest(ListViewTestCase):
  def test_should_get_succeed(self):
    self.should_get_all_succeed(USER_LIST_URL, User, token=self.admin_user_token)

  def test_should_get_require_role(self):
    response = self.client.get(USER_LIST_URL, HTTP_AUTHORIZATION='Bearer {0}'.format(self.reader_user_token))
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_get_with_filter_succeed(self):
    url = '{0}?group__in=["manager"]'.format(USER_LIST_URL)
    self.should_get_succeed_with_filter(url, User, {'group__in': ['manager']}, token=self.manager_user_token)

  def test_should_get_with_exclude_succeed(self):
    url = '{0}?exclude=["email"]'.format(USER_LIST_URL)
    self.should_get_succeed_with_exclude(url, User, exclude=['email'], token=self.manager_user_token)

  def test_should_get_with_serialized_field_succeed(self):
    url = '{0}?serialize=["group"]'.format(USER_LIST_URL)
    self.should_get_succeed_with_serialize(url, User, serialize=['group'], token=self.manager_user_token)

  def test_should_post_succeed(self):
    data = get_user_data('Tim', 'teymur@email.com', 'Passw0rd', 'reader')
    expected = data.copy()
    del expected[PASSWORD_FIELD]
    self.should_post_succeed(USER_LIST_URL, data, self.admin_user_token, expected)

  def test_should_post_require_auth(self):
    self.should_post_require_auth(USER_LIST_URL)

  def test_should_post_require_role(self):
    self.should_post_require_role(USER_LIST_URL, self.reader_user_token)

  def test_should_post_null_values(self):
    data = get_user_data()
    expected_content = {
      NAME_FIELD: ['errors.users.name.mustNotBeNull'],
      EMAIL_FIELD: ['errors.users.email.mustNotBeNull'],
      PASSWORD_FIELD: ['errors.users.password.mustNotBeNull'],
      GROUP_FIELD: ['errors.users.group.mustNotBeNull']
    }
    self.should_post_fail(USER_LIST_URL, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_empty_values(self):
    data = get_user_data('', '', '', '')
    expected_content = {
      NAME_FIELD: ['errors.users.name.mustNotBeEmpty'],
      EMAIL_FIELD: ['errors.users.email.isEmail'],
      PASSWORD_FIELD: ['errors.users.password.regex'],
      GROUP_FIELD: ['errors.users.group.mustNotBeEmpty']
    }
    self.should_post_fail(USER_LIST_URL, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_invalid_values(self):
    data = get_user_data('Name', 'wrong email', 'wrong password', 'reader')
    expected_content = {
      EMAIL_FIELD: ['errors.users.email.isEmail'],
      PASSWORD_FIELD: ['errors.users.password.regex'],
    }
    self.should_post_fail(USER_LIST_URL, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_invalid_group(self):
    data = get_user_data('Name', 'teymur@email.com', 'Passw0rd', 'invalid group')
    expected_content = {
      GLOBAL_ERR_KEY: [get_not_exist_msg(Group)],
    }
    self.should_post_fail(USER_LIST_URL, data=data, expected_content=expected_content, token=self.admin_user_token)
