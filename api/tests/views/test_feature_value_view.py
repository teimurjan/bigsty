import json

from django.test import TestCase

from api.models import User, FeatureValue
from api.serializers import generate_token
from api.tests.views.constants import FEATURE_VALUE_LIST_URL
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, NO_DATA_ERR, VALUE_LENGTH_ERR, INVALID_FEATURE_TYPE_ID_ERR
from api.utils.errors.error_messages import get_field_empty_msg
from api.utils.form_fields_constants import DATA_KEY, NAME_FIELD, FEATURE_TYPE_FIELD
from api.utils.response_constants import OK_CODE, NOT_FOUND_CODE, FORBIDDEN_CODE, BAD_REQUEST_CODE


def url(feature_value_id):
  return '%s/%s' % (FEATURE_VALUE_LIST_URL, feature_value_id)


class FeatureValueViewTest(TestCase):
  fixtures = ['feature_value_view_test.json']

  def setUp(self):
    user = User.objects.get(pk=1)
    self.token = generate_token(user)

  def send_put_request(self, feature_value_id, data_dict=None, token=None):
    return self.client.put(url(feature_value_id), json.dumps(data_dict),
                           HTTP_AUTHORIZATION=token, content_type='application/json')

  def test_should_get_success(self):
    feature_value_id = 1
    response = self.client.get(url(feature_value_id))
    self.assertEqual(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEqual(data, FeatureValue.objects.get(pk=feature_value_id).to_dict())

  def test_should_get_throws_not_found(self):
    feature_value_id = 11
    response = self.client.get(url(feature_value_id))
    self.assertEqual(response.status_code, NOT_FOUND_CODE)

  def test_should_update_success(self):
    feature_value_id = 1
    data_dict = {NAME_FIELD: 'New name', FEATURE_TYPE_FIELD: 2}
    response = self.send_put_request(feature_value_id, data_dict, self.token)
    self.assertEqual(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEqual(data[NAME_FIELD], data_dict[NAME_FIELD])
    self.assertEqual(data[FEATURE_TYPE_FIELD], data_dict[FEATURE_TYPE_FIELD])

  def test_should_update_throws_admin_required(self):
    feature_value_id = 1
    data_dict = {NAME_FIELD: 'New name', FEATURE_TYPE_FIELD: 2}
    response = self.send_put_request(feature_value_id, data_dict)
    self.assertEqual(response.status_code, FORBIDDEN_CODE)

  def test_should_update_throws_no_data(self):
    feature_value_id = 1
    response = self.send_put_request(feature_value_id, token=self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    errors = json.loads(response.content.decode())
    self.assertEqual(errors[GLOBAL_ERR_KEY][0], NO_DATA_ERR)

  def test_should_post_throws_no_values_err(self):
    data_dict = {}
    feature_value_id = 1
    response = self.send_put_request(feature_value_id, data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    errors = json.loads(response.content.decode())
    self.assertEqual(errors[NAME_FIELD][0], get_field_empty_msg(NAME_FIELD))
    self.assertEqual(errors[FEATURE_TYPE_FIELD][0], get_field_empty_msg(FEATURE_TYPE_FIELD))

  def test_should_post_throws_invalid_length(self):
    feature_value_id = 1
    data_dict = {NAME_FIELD: '', FEATURE_TYPE_FIELD: 1}
    response = self.send_put_request(feature_value_id, data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    errors = json.loads(response.content.decode())
    self.assertEqual(errors[NAME_FIELD][0], VALUE_LENGTH_ERR % (NAME_FIELD.capitalize(), 1, 30))

  def test_should_post_throws_invalid_feature_type(self):
    feature_value_id = 1
    data_dict = {NAME_FIELD: 'Test', FEATURE_TYPE_FIELD: 11}
    response = self.send_put_request(feature_value_id, data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    errors = json.loads(response.content.decode())
    self.assertEqual(errors[FEATURE_TYPE_FIELD][0], INVALID_FEATURE_TYPE_ID_ERR)

  def test_should_update_throws_not_found(self):
    feature_value_id = 11
    data_dict = {NAME_FIELD: 'Test', FEATURE_TYPE_FIELD: 11}
    response = self.send_put_request(feature_value_id, data_dict, self.token)
    self.assertEqual(response.status_code, NOT_FOUND_CODE)

