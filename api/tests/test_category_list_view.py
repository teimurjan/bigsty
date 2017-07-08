import json

from django.test import TestCase

from api.models import Category, User, FeatureType
from api.serializers import generate_token
from api.tests.constants import CATEGORY_LIST_URL
from api.utils.errors.error_constants import SAME_CATEGORY_NAME_ERR, GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_field_empty_msg, get_not_exist_msg
from api.utils.form_fields_constants import DATA_KEY, NAME_FIELD, FEATURE_TYPES_FIELD
from api.utils.response_constants import OK_CODE, FORBIDDEN_CODE, BAD_REQUEST_CODE, NOT_FOUND_CODE

TEST_NAME = 'Test category'


class CategoryListViewTest(TestCase):
  fixtures = ['category_list_view_test.json']

  def setUp(self):
    user = User.objects.get(pk=2)
    self.token = generate_token(user)

  def send_post_request(self, data_dict, token=None):
    return self.client.post(CATEGORY_LIST_URL, json.dumps(data_dict), HTTP_AUTHORIZATION='Bearer %s' % token,
                            content_type='application/json')

  def get_data_dict(self, name=None, feature_types_ids=None):
    return {NAME_FIELD: name, FEATURE_TYPES_FIELD: feature_types_ids}

  def test_should_get_success(self):
    response = self.client.get(CATEGORY_LIST_URL)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())
    categories = data[DATA_KEY]
    categories_in_db = Category.objects.all()
    self.assertEquals(categories[1], categories_in_db[1].to_dict())
    self.assertEquals(len(categories), len(categories_in_db))

  def test_should_post_success(self):
    data_dict = self.get_data_dict(TEST_NAME, [1, 2])
    response = self.send_post_request(data_dict, self.token)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    data_dict[NAME_FIELD] = data[NAME_FIELD]
    data_dict[FEATURE_TYPES_FIELD] = data[FEATURE_TYPES_FIELD]

  def test_should_post_admin_required(self):
    data_dict = self.get_data_dict(TEST_NAME, [1, 2])
    response = self.send_post_request(data_dict, 'Invalid')
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_post_no_values(self):
    data_dict = self.get_data_dict()
    response = self.send_post_request(data_dict, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[NAME_FIELD][0], get_field_empty_msg(NAME_FIELD))
    self.assertEquals(data[FEATURE_TYPES_FIELD][0], get_field_empty_msg(FEATURE_TYPES_FIELD))

  def test_should_post_name_exists(self):
    data_dict = self.get_data_dict(Category.objects.all()[0].name, [])
    response = self.send_post_request(data_dict, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[NAME_FIELD][0], SAME_CATEGORY_NAME_ERR)

  def test_should_post_no_such_feature_type(self):
    data_dict = self.get_data_dict(TEST_NAME, [23])
    response = self.send_post_request(data_dict, self.token)
    self.assertEquals(response.status_code, NOT_FOUND_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], get_not_exist_msg(FeatureType))

