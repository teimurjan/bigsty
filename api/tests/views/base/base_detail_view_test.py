import json
from typing import Type

from api.models.base import SerializableModel
from api.tests.views.base.base_view_test import ViewTestCase
from api.utils.errors.error_constants import GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields import DATA_KEY
from api.utils.http_constants import OK_CODE, FORBIDDEN_CODE, UNAUTHROZIED_CODE, BAD_REQUEST_CODE, NOT_FOUND_CODE


class DetailViewTestCase(ViewTestCase):
  def should_get_by_id_succeed(self, list_url: str, Model: Type[SerializableModel], model_id: int) -> None:
    expected = Model.objects.get(pk=model_id).serialize()
    url = '{0}/{1}'.format(list_url, model_id)
    self.should_get_succeed(url, expected)

  def should_get_by_id_fail(self, list_url: str, Model: Type[SerializableModel], model_id: int) -> None:
    url = '{0}/{1}'.format(list_url, model_id)
    self.should_get_fail(url, NOT_FOUND_CODE, {GLOBAL_ERR_KEY: [get_not_exist_msg(Model)]})

  def should_put_succeed(self, url: str, data: dict, token: str, expected: dict) -> dict:
    response = self.send_put_request(url, data, token)
    self.assertEquals(response.status_code, OK_CODE)
    response_data = json.loads(response.content.decode())[DATA_KEY]
    for k, v in expected.items():
      self.assertEquals(response_data[k], v)
    return response_data

  def should_put_require_role(self, url: str, token):
    response = self.send_put_request(url, token=token)
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def should_put_require_auth(self, url: str):
    response = self.send_put_request(url)
    self.assertEquals(response.status_code, UNAUTHROZIED_CODE)

  def should_put_fail(self, url: str, data: dict = None,
                      expected_code: int = BAD_REQUEST_CODE,
                      expected_content: dict = None,
                      token: str = None) -> None:
    response = self.send_put_request(url, data, token)
    self.assertEquals(response.status_code, expected_code)
    if not expected_content: return
    content = json.loads(response.content.decode())
    self.assertEquals(content, expected_content)

  def should_put_fail_when_no_data_sent(self, url: str, token: str) -> None:
    self.should_put_fail(url, token=token)
