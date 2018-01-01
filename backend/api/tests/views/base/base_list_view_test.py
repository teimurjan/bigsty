import json
from typing import Type

from api.models.base import SerializableModel
from api.tests.views.base.base_view_test import ViewTestCase

from api.utils.http_constants import OK_CODE, FORBIDDEN_CODE, UNAUTHORIZED_CODE, BAD_REQUEST_CODE


class ListViewTestCase(ViewTestCase):
  def should_get_all_succeed(self, url: str, Model: Type[SerializableModel], token: str = None) -> None:
    expected = [model.serialize() for model in Model.objects.all()]
    self.should_get_succeed(url, expected, token)

  def should_get_succeed_with_filter(self, url: str, Model: Type[SerializableModel], filter_dict: dict,
                                     token: str = None) -> None:
    expected = [model.serialize() for model in Model.objects.filter(**filter_dict)]
    self.should_get_succeed(url, expected, token)

  def should_get_succeed_with_serialize(self, url: str, Model: Type[SerializableModel], serialize: list,
                                        token: str = None) -> None:
    expected = [model.serialize(serialize=serialize) for model in Model.objects.all()]
    self.should_get_succeed(url, expected, token)

  def should_get_succeed_with_exclude(self, url: str, Model: Type[SerializableModel], exclude: list,
                                      token: str = None) -> None:
    expected = [model.serialize(exclude=exclude) for model in Model.objects.all()]
    self.should_get_succeed(url, expected, token)

  def should_post_succeed(self, url: str, data: dict, token: str, expected: dict) -> dict:
    response = self.send_post_request(url, data, token)
    self.assertEquals(response.status_code, OK_CODE)
    response_data = json.loads(response.content.decode())['data']
    for k, v in expected.items():
      self.assertEqual(response_data[k], v)
    return response_data

  def should_post_require_role(self, url: str, token):
    response = self.send_post_request(url, token=token)
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def should_post_require_auth(self, url: str):
    response = self.send_post_request(url)
    self.assertEquals(response.status_code, UNAUTHORIZED_CODE)

  def should_post_fail(self, url: str, data: dict = None,
                       expected_code: int = BAD_REQUEST_CODE,
                       expected_content: dict = None,
                       token: str = None) -> None:
    response = self.send_post_request(url, data, token)
    self.assertEquals(response.status_code, expected_code)
    if not expected_content: return
    content = json.loads(response.content.decode())
    self.assertEquals(content, expected_content)

  def should_post_fail_when_no_data_sent(self, url: str, token: str) -> None:
    self.should_post_fail(url, token=token)
