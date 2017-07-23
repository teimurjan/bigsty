import json

from django.test import TestCase

from api.models import User, FeatureType
from api.serializers import generate_token
from api.tests.constants import FEATURE_TYPE_LIST_URL
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, NO_DATA_ERR, SAME_FEATURE_TYPE_NAME_ERR, VALUE_LENGTH_ERR
from api.utils.errors.error_messages import get_field_empty_msg
from api.utils.form_fields_constants import DATA_KEY, NAME_FIELD, CATEGORIES_FIELD
from api.utils.response_constants import OK_CODE, FORBIDDEN_CODE, BAD_REQUEST_CODE


class FeatureTypeListViewTest(TestCase):
  fixtures = ['feature_type_list_view_test.json']

  def setUp(self):
    user = User.objects.get(pk=1)
    self.token = generate_token(user)

  def send_post_request(self, data_dict=None, token=None):
    return self.client.post(FEATURE_TYPE_LIST_URL, json.dumps(data_dict),
                            HTTP_AUTHORIZATION=token, content_type='application/json')

  def test_should_get_success(self):
    response = self.client.get(FEATURE_TYPE_LIST_URL)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEquals(data, [feature_type.to_dict() for feature_type in FeatureType.objects.all()])

  def test_should_post_success(self):
    data_dict = {NAME_FIELD: 'Test Feature'}
    response = self.send_post_request(data_dict, self.token)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEquals(data[NAME_FIELD], data_dict[NAME_FIELD])
    self.assertEquals(len(data[CATEGORIES_FIELD]), 0)

  def test_should_post_throws_admin_required(self):
    data_dict = {NAME_FIELD: 'Test Feature'}
    response = self.send_post_request(data_dict)
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_post_throws_no_name_err(self):
    response = self.send_post_request({}, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[NAME_FIELD][0], get_field_empty_msg(NAME_FIELD))

  def test_should_post_throws_no_data_err(self):
    response = self.send_post_request(token=self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], NO_DATA_ERR)

  def test_should_post_throws_same_name_err(self):
    name = FeatureType.objects.all()[0].name
    response = self.send_post_request({NAME_FIELD: name}, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[NAME_FIELD][0], SAME_FEATURE_TYPE_NAME_ERR)

  def test_should_post_throws_invalid_length(self):
    response = self.send_post_request({NAME_FIELD: ''}, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[NAME_FIELD][0], VALUE_LENGTH_ERR % (NAME_FIELD.capitalize(), 1, 30))
