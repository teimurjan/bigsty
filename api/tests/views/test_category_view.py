import json

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Model
from django.test import TestCase

from api.models import User, Category, FeatureType, BaseModel
from api.serializers import generate_token
from api.tests.views.constants import CATEGORY_LIST_URL
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, SAME_CATEGORY_NAME_ERR
from api.utils.errors.error_messages import get_not_exist_msg, get_field_empty_msg
from api.utils.form_fields_constants import DATA_KEY, NAME_FIELD, FEATURE_TYPES_FIELD
from api.utils.response_constants import OK_CODE, NOT_FOUND_CODE, FORBIDDEN_CODE


def url(user_id):
  return '%s/%s' % (CATEGORY_LIST_URL, user_id)


def get_category_dict(name=None, feature_types_ids=None):
  return {NAME_FIELD: name, FEATURE_TYPES_FIELD: feature_types_ids}


class CategoryListViewTest(TestCase):
  fixtures = ['category_view_test.json']

  def send_put_request(self, category_id, data_dict, token=None):
    return self.client.put(url(category_id), json.dumps(data_dict), HTTP_AUTHORIZATION=token)

  def setUp(self):
    user = User.objects.get(pk=2)
    self.token = generate_token(user)

  def test_should_get_success(self):
    category_id = 2
    response = self.client.get(url(category_id))
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    category = Category.objects.get(pk=category_id)
    self.assertEquals(data, category.to_dict())

  def test_should_get_not_found(self):
    category_id = 22
    response = self.client.get(url(category_id))
    self.assertEquals(response.status_code, NOT_FOUND_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], get_not_exist_msg(Category))

  def test_should_update_success(self):
    category_id = 2
    data_dict = get_category_dict('New Name', [1])
    response = self.send_put_request(category_id, data_dict, self.token)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEquals(data[NAME_FIELD], data_dict[NAME_FIELD])
    self.assertEquals(data[FEATURE_TYPES_FIELD], data_dict[FEATURE_TYPES_FIELD])

  def test_should_update_throws_admin_required(self):
    category_id = 1
    data_dict = get_category_dict('New Name', [1, 2])
    response = self.send_put_request(category_id, data_dict)
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_update_throws_same_category_name(self):
    category_id = 2
    data_dict = get_category_dict(Category.objects.all()[0].name, [1, 2])
    response = self.send_put_request(category_id, data_dict, self.token)
    data = json.loads(response.content.decode())
    self.assertEquals(data[NAME_FIELD][0], SAME_CATEGORY_NAME_ERR)

  def test_should_update_throws_no_values(self):
    category_id = 2
    data_dict = get_category_dict()
    response = self.send_put_request(category_id, data_dict, self.token)
    data = json.loads(response.content.decode())
    self.assertEquals(data[NAME_FIELD][0], get_field_empty_msg(NAME_FIELD))
    self.assertEquals(data[FEATURE_TYPES_FIELD][0], get_field_empty_msg(FEATURE_TYPES_FIELD))

  def test_should_update_throws_feature_type_not_found(self):
    category_id = 2
    data_dict = get_category_dict('New Name', [33])
    response = self.send_put_request(category_id, data_dict, self.token)
    self.assertEquals(response.status_code, NOT_FOUND_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], get_not_exist_msg(FeatureType))

  def test_should_delete_success(self):
    category_id = 2
    response = self.client.delete(url(category_id), HTTP_AUTHORIZATION=self.token)
    self.assertEquals(response.status_code, OK_CODE)

  def test_should_delete_throw_admin_required(self):
    category_id = 2
    response = self.client.delete(url(category_id))
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_delete_throw_not_found(self):
    category_id = 22
    response = self.client.delete(url(category_id), HTTP_AUTHORIZATION=self.token)
    self.assertEquals(response.status_code, NOT_FOUND_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], get_not_exist_msg(Category))