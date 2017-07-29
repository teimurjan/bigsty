import json

from django.test import TestCase

from api.models import User, FeatureType
from api.serializers import generate_token
from api.tests.views.constants import FEATURE_TYPE_LIST_URL
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, NO_DATA_ERR, SAME_FEATURE_TYPE_NAME_ERR, VALUE_LENGTH_ERR
from api.utils.errors.error_messages import get_field_empty_msg
from api.utils.form_fields_constants import DATA_KEY, NAME_FIELD
from api.utils.response_constants import OK_CODE, NOT_FOUND_CODE, FORBIDDEN_CODE, BAD_REQUEST_CODE


def url(feature_type_id):
  return '%s/%s' % (FEATURE_TYPE_LIST_URL, feature_type_id)


class FeatureTypeViewTest(TestCase):
  fixtures = ['feature_type_view_test.json']

  def setUp(self):
    user = User.objects.get(pk=1)
    self.token = generate_token(user)

  def send_put_request(self, feature_type_id, data_dict=None, token=None):
    return self.client.put(url(feature_type_id), json.dumps(data_dict),
                           HTTP_AUTHORIZATION=token, content_type='application/json')

  def test_should_get_success(self):
    feature_type_id = 1
    response = self.client.get(url(feature_type_id))
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEquals(data, FeatureType.objects.get(pk=feature_type_id).to_dict())

  def test_should_get_throws_not_found(self):
    feature_type_id = 11
    response = self.client.get(url(feature_type_id))
    self.assertEquals(response.status_code, NOT_FOUND_CODE)

  def test_should_update_success(self):
    feature_type_id = 1
    data_dict = {NAME_FIELD: 'New name'}
    response = self.send_put_request(feature_type_id, data_dict, self.token)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEquals(data[NAME_FIELD], data_dict[NAME_FIELD])

  def test_should_throws_not_found(self):
    feature_type_id = 11
    data_dict = {NAME_FIELD: 'New name'}
    response = self.send_put_request(feature_type_id, data_dict, self.token)
    self.assertEquals(response.status_code, NOT_FOUND_CODE)

  def test_should_throws_admin_required(self):
    feature_type_id = 1
    data_dict = {NAME_FIELD: 'New name'}
    response = self.send_put_request(feature_type_id, data_dict)
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_throws_no_name_err(self):
    feature_type_id = 1
    response = self.send_put_request(feature_type_id, {}, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[NAME_FIELD][0], get_field_empty_msg(NAME_FIELD))

  def test_should_throws_no_data_err(self):
    feature_type_id = 1
    response = self.send_put_request(feature_type_id, token=self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], NO_DATA_ERR)

  def test_should_throws_invalid_name_length_err(self):
    feature_type_id = 1
    data_dict = {NAME_FIELD: ''}
    response = self.send_put_request(feature_type_id, data_dict, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[NAME_FIELD][0], VALUE_LENGTH_ERR % (NAME_FIELD.capitalize(), 1, 30))

  def test_should_delete_success(self):
    feature_type_id = 1
    response = self.client.delete(url(feature_type_id), HTTP_AUTHORIZATION=self.token)
    self.assertEquals(response.status_code, OK_CODE)

  def test_should_delete_throws_admin_required(self):
    feature_type_id = 1
    response = self.client.delete(url(feature_type_id))
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_delete_throws_not_found(self):
    feature_type_id = 11
    response = self.client.delete(url(feature_type_id), HTTP_AUTHORIZATION=self.token)
    self.assertEquals(response.status_code, NOT_FOUND_CODE)