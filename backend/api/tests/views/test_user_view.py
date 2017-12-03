from api.models import User, Group
from api.tests.views.base.base_detail_view_test import DetailViewTestCase
from api.tests.views.constants import USER_LIST_URL
from api.utils.errors.error_constants import GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields import NAME_FIELD, PASSWORD_FIELD, GROUP_FIELD, EMAIL_FIELD, ID_FIELD
from api.utils.http_constants import FORBIDDEN_CODE


def get_user_data(name=None, password=None, group_id=None):
  return {NAME_FIELD: name, PASSWORD_FIELD: password, GROUP_FIELD: group_id}


class UserViewTest(DetailViewTestCase):
  def test_should_get_succeed(self):
    self.should_get_by_id_succeed(USER_LIST_URL, User, self.reader_user.pk, token=self.admin_user_token)

  def test_should_get_require_role(self):
    url = '{0}/{1}'.format(USER_LIST_URL, self.manager_user.pk)
    response = self.client.get(url, HTTP_AUTHORIZATION='Bearer {0}'.format(self.reader_user_token))
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_get_with_exclude_succeed(self):
    url = '{0}/{1}?exclude=["email"]'.format(USER_LIST_URL, self.manager_user.pk)
    expected = self.manager_user.serialize(exclude=['email'])
    self.should_get_succeed(url, expected, token=self.manager_user_token)

  def test_should_get_with_serialized_field_succeed(self):
    url = '{0}/{1}?serialize=["group"]'.format(USER_LIST_URL, self.manager_user.pk)
    expected = self.manager_user.serialize(serialize=['group'])
    self.should_get_succeed(url, expected, token=self.manager_user_token)

  def test_should_put_succeed(self):
    user = self.reader_user
    data = get_user_data('New reader name', 'Passw0rd', 'reader')
    expected = data.copy()
    expected[EMAIL_FIELD] = user.email
    expected[ID_FIELD] = self.reader_user.pk
    del expected[PASSWORD_FIELD]
    url = '{0}/{1}'.format(USER_LIST_URL, user.pk)
    self.should_put_succeed(url, data, self.admin_user_token, expected)

  def test_should_put_require_auth(self):
    user = self.reader_user
    url = '{0}/{1}'.format(USER_LIST_URL, user.pk)
    self.should_put_require_auth(url)

  def test_should_post_require_role(self):
    user = self.reader_user
    url = '{0}/{1}'.format(USER_LIST_URL, user.pk)
    self.should_put_require_role(url, self.reader_user_token)

  def test_should_put_null_values(self):
    data = get_user_data()
    expected_content = {
      NAME_FIELD: ['errors.user.name.mustNotBeNull'],
      PASSWORD_FIELD: ['errors.user.password.mustNotBeNull'],
      GROUP_FIELD: ['errors.user.group.mustNotBeNull']
    }
    url = '{0}/{1}'.format(USER_LIST_URL, self.reader_user.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_empty_values(self):
    data = get_user_data('', '', '')
    expected_content = {
      NAME_FIELD: ['errors.user.name.mustNotBeEmpty'],
      PASSWORD_FIELD: ['errors.user.password.regex'],
      GROUP_FIELD: ['errors.user.group.mustNotBeEmpty']
    }
    url = '{0}/{1}'.format(USER_LIST_URL, self.reader_user.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_invalid_values(self):
    data = get_user_data('Name', 'wrong password', 'reader')
    expected_content = {
      PASSWORD_FIELD: ['errors.user.password.regex'],
    }
    url = '{0}/{1}'.format(USER_LIST_URL, self.reader_user.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_invalid_group(self):
    data = get_user_data('Name', 'Passw0rd', 'invalid group')
    expected_content = {
      GLOBAL_ERR_KEY: [get_not_exist_msg(Group)],
    }
    url = '{0}/{1}'.format(USER_LIST_URL, self.reader_user.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_delete_succeed(self):
    user = User.objects.all()[0]
    self.should_delete_succeed(USER_LIST_URL, user.pk, self.admin_user_token)

  def test_should_delete_require_role(self):
    user = User.objects.all()[0]
    self.should_delete_require_role(USER_LIST_URL, user.pk, self.reader_user_token)

  def test_should_delete_not_found(self):
    self.should_delete_not_found(USER_LIST_URL, User, 999, self.admin_user_token)
