import json
from typing import Type, List

from django.test import TestCase
from shutil import rmtree

from api.models import User
from api.tests.views.fixtures.base.fixture import IFixture
from api.tests.views.fixtures.common.users_fixture import UsersFixture
from api.utils.form_fields import DATA_KEY
from api.utils.http_constants import OK_CODE


class ViewTestCase(TestCase):
  _fixtures: List[Type[IFixture]] = [UsersFixture]
  _rm_after: List[str] = None

  @classmethod
  def setUpClass(cls):
    super().setUpClass()
    for fixture in cls._fixtures: fixture.make()
    cls.admin_user = User.objects.filter(group='admin')[0]
    cls.admin_user.token = cls.admin_user.generate_token()
    cls.admin_user.save()
    cls.manager_user = User.objects.filter(group='manager')[0]
    cls.manager_user.token = cls.manager_user.generate_token()
    cls.manager_user.save()
    cls.reader_user = User.objects.filter(group='reader')[0]
    cls.reader_user.token = cls.reader_user.generate_token()
    cls.reader_user.save()

  @classmethod
  def tearDownClass(cls):
    super().tearDownClass()
    if cls._rm_after:
      for path in cls._rm_after:
        rmtree(path, ignore_errors=True)

  def send_request_with_data(self, method: str, url: str, data: dict, token: str):
    send = getattr(self.client, method)
    return send(url, json.dumps(data),
                HTTP_AUTHORIZATION='Bearer {token}'.format(token=token),
                content_type='application/json')

  def send_post_request(self, url: str, data: dict = None, token: str = None):
    return self.send_request_with_data('post', url, data, token)

  def send_put_request(self, url: str, data: dict = None, token: str = None):
    return self.send_request_with_data('put', url, data, token)

  def should_get_succeed(self, url: str, expected: list, token: str = None):
    response = self.client.get(url, HTTP_AUTHORIZATION='Bearer {token}'.format(token=token))
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEquals(data, expected)

  def should_get_fail(self, url: str, expected_code: int, expected_content: dict):
    response = self.client.get(url)
    self.assertEquals(response.status_code, expected_code)
    content = json.loads(response.content.decode())
    self.assertEquals(content, expected_content)
