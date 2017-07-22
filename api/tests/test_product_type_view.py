import base64
import json
import os

from django.test import TestCase

from api.models import User, ProductType
from api.serializers import generate_token
from api.tests.constants import PRODUCT_TYPE_LIST_URL
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, NO_DATA_ERR
from api.utils.errors.error_messages import get_not_exist_msg, get_field_empty_msg
from api.utils.form_fields_constants import DATA_KEY, NAME_FIELD, DESCRIPTION_FIELD, SHORT_DESCRIPTION_FIELD, \
  CATEGORY_FIELD, IMAGE_FIELD, FEATURE_VALUES_FIELD
from api.utils.response_constants import OK_CODE, NOT_FOUND_CODE, FORBIDDEN_CODE, BAD_REQUEST_CODE


def url(product_type_id):
  return '%s/%s' % (PRODUCT_TYPE_LIST_URL, product_type_id)


def get_product_type_dict(name=None, description=None, short_description=None, feature_values=None, category=None,
                          image=None):
  return {NAME_FIELD: name, DESCRIPTION_FIELD: description, SHORT_DESCRIPTION_FIELD: short_description,
          FEATURE_VALUES_FIELD: feature_values, CATEGORY_FIELD: category, IMAGE_FIELD: image}


class ProductTypeViewTest(TestCase):
  fixtures = ['product_type_view_test.json']

  def setUp(self):
    user = User.objects.get(pk=1)
    self.token = generate_token(user)

  def send_put_request(self, product_type_id, data_dict=None, token=None):
    return self.client.put(url(product_type_id), json.dumps(data_dict), HTTP_AUTHORIZATION=token)

  def test_should_get_success(self):
    product_type_id = 1
    response = self.client.get(url(product_type_id))
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())
    product_type = data[DATA_KEY]
    product_type_from_db = ProductType.objects.get(pk=product_type_id)
    self.assertEquals(product_type, product_type_from_db.to_dict())

  def test_should_get_throws_not_found(self):
    product_type_id = 11
    response = self.client.get(url(product_type_id))
    self.assertEquals(response.status_code, NOT_FOUND_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], get_not_exist_msg(ProductType))

  def test_should_update_success(self):
    product_type_id = 1
    pwd = os.path.dirname(__file__)
    with open('%s/assets/test.jpg' % pwd, 'rb') as image:
      base64image = 'data:image/jpg;base64,%s' % base64.b64encode(image.read()).decode()
    data_dict = get_product_type_dict('New Name', 'New Description', 'New Short description', [1, 2], 1, base64image)
    response = self.send_put_request(product_type_id, data_dict, self.token)
    self.assertEquals(response.status_code, OK_CODE)
    product_type = json.loads(response.content.decode())[DATA_KEY]
    self.assertEquals(product_type[NAME_FIELD], data_dict[NAME_FIELD])
    self.assertEquals(product_type[DESCRIPTION_FIELD], data_dict[DESCRIPTION_FIELD])
    self.assertEquals(product_type[SHORT_DESCRIPTION_FIELD], data_dict[SHORT_DESCRIPTION_FIELD])
    self.assertEquals(product_type[FEATURE_VALUES_FIELD], data_dict[FEATURE_VALUES_FIELD])
    self.assertEquals(product_type[CATEGORY_FIELD], data_dict[CATEGORY_FIELD])
    self.assertIsNotNone(product_type[IMAGE_FIELD])

  def test_should_update_throws_admin_required(self):
    product_type_id = 1
    pwd = os.path.dirname(__file__)
    with open('%s/assets/test.jpg' % pwd, 'rb') as image:
      base64image = 'data:image/jpg;base64,%s' % base64.b64encode(image.read()).decode()
    data_dict = get_product_type_dict('New Name', 'New Description', 'New Short description', [1, 2], 1, base64image)
    response = self.send_put_request(product_type_id, data_dict)
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_update_throws_no_values(self):
    product_type_id = 1
    data_dict = get_product_type_dict()
    response = self.send_put_request(product_type_id, data_dict, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[NAME_FIELD][0], get_field_empty_msg(NAME_FIELD))
    self.assertEquals(data[DESCRIPTION_FIELD][0], get_field_empty_msg(DESCRIPTION_FIELD))
    self.assertEquals(data[SHORT_DESCRIPTION_FIELD][0], get_field_empty_msg(SHORT_DESCRIPTION_FIELD))
    self.assertEquals(data[FEATURE_VALUES_FIELD][0], get_field_empty_msg(FEATURE_VALUES_FIELD))
    self.assertEquals(data[CATEGORY_FIELD][0], get_field_empty_msg(CATEGORY_FIELD))
    self.assertEquals(data[IMAGE_FIELD][0], get_field_empty_msg(IMAGE_FIELD))

  def test_should_update_throws_no_data(self):
    product_type_id = 1
    response = self.send_put_request(product_type_id, token=self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], NO_DATA_ERR)

  def test_should_delete_success(self):
    product_type_id = 1
    response = self.client.delete(url(product_type_id), HTTP_AUTHORIZATION=self.token)
    self.assertEquals(response.status_code, OK_CODE)

  def test_should_delete_throws_admin_required(self):
    product_type_id = 1
    response = self.client.delete(url(product_type_id))
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_delete_throws_not_found(self):
    product_type_id = 11
    response = self.client.delete(url(product_type_id), HTTP_AUTHORIZATION=self.token)
    self.assertEquals(response.status_code, NOT_FOUND_CODE)

