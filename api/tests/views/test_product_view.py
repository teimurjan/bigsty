import base64
import json

import os
from django.test import TestCase

from api.models import User, Product, ProductType, FeatureValue
from api.services import generate_token
from api.tests.views.constants import PRODUCT_LIST_URL
from api.utils.errors.error_constants import NO_DATA_ERR, GLOBAL_ERR_KEY, PRICE_VALUE_ERR, DISCOUNT_VALUE_ERR, \
  QUANTITY_VALUE_ERR, PRICE_NOT_INT_ERR, DISCOUNT_NOT_INT_ERR, QUANTITY_NOT_INT_ERR, INVALID_FEATURE_TYPE_ID_ERR, \
  NOT_VALID_IMAGE
from api.utils.errors.error_messages import get_field_empty_msg, get_not_exist_msg
from api.utils.form_fields import DATA_KEY, IMAGES_FIELD, QUANTITY_FIELD, PRICE_FIELD, DISCOUNT_FIELD, \
  PRODUCT_TYPE_FIELD, FEATURE_VALUES_FIELD
from api.utils.http_constants import OK_CODE, NOT_FOUND_CODE, FORBIDDEN_CODE, BAD_REQUEST_CODE

VALID_DISCOUNT = 10
VALID_PRICE = 100
VALID_QUANTITY = 5

INVALID_DISCOUNT = 150
INVALID_PRICE = -VALID_PRICE
INVALID_QUANTITY = -VALID_QUANTITY


def url(product_id):
  return '%s/%s' % (PRODUCT_LIST_URL, product_id)


def get_product_dict(discount=None, price=None, quantity=None, product_type_id=None, feature_values_ids=None,
                     images=None):
  return {DISCOUNT_FIELD: discount, PRICE_FIELD: price, QUANTITY_FIELD: quantity, PRODUCT_TYPE_FIELD: product_type_id,
          FEATURE_VALUES_FIELD: feature_values_ids, IMAGES_FIELD: images}


class ProductViewTest(TestCase):
  fixtures = ['product_view_test.json']

  def setUp(self):
    user = User.objects.get(pk=1)
    self.token = generate_token(user)

    pwd = os.path.dirname(__file__)
    self.images = []
    for i in range(1, 4):
      with open('%s/assets/products_images/%s.jpg' % (pwd, i), 'rb') as image:
        self.images.append('data:image/jpg;base64,%s' % base64.b64encode(image.read()).decode())

  def send_put_request(self, product_id, data_dict=None, token=None):
    return self.client.put(url(product_id), json.dumps(data_dict), HTTP_AUTHORIZATION='Bearer %s' % token)

  def test_should_get_success(self):
    product_id = 1
    response = self.client.get(url(product_id))
    self.assertEqual(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEqual(data, Product.objects.get(pk=product_id).dictify())

  def test_should_get_throws_not_found(self):
    product_id = 11
    response = self.client.get(url(product_id))
    self.assertEqual(response.status_code, NOT_FOUND_CODE)

  def test_should_update_success(self):
    product_id = 1
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, product_type_id=2,
                                 feature_values_ids=[1, 2], images=self.images)
    response = self.send_put_request(product_id, data_dict, self.token)
    self.assertEqual(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEqual(data_dict[DISCOUNT_FIELD], data[DISCOUNT_FIELD])
    self.assertEqual(data_dict[PRICE_FIELD], data[PRICE_FIELD])
    self.assertEqual(data_dict[QUANTITY_FIELD], data[QUANTITY_FIELD])
    self.assertEqual(data_dict[PRODUCT_TYPE_FIELD], data[PRODUCT_TYPE_FIELD])
    self.assertEqual(data_dict[FEATURE_VALUES_FIELD], data[FEATURE_VALUES_FIELD])
    self.assertEqual(len(data_dict[IMAGES_FIELD]), len(data[IMAGES_FIELD]))

  def test_should_update_throws_admin_required(self):
    product_id = 1
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, 2, [1, 2], self.images)
    response = self.send_put_request(product_id, data_dict)
    self.assertEqual(response.status_code, FORBIDDEN_CODE)

  def test_should_update_throw_not_found(self):
    product_id = 11
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, 2, [1, 2], self.images)
    response = self.send_put_request(product_id, data_dict, self.token)
    self.assertEqual(response.status_code, NOT_FOUND_CODE)

  def test_should_update_throws_no_values(self):
    product_id = 1
    response = self.send_put_request(product_id, {}, self.token)
    data = json.loads(response.content.decode())
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    self.assertEqual(data[DISCOUNT_FIELD][0], get_field_empty_msg(DISCOUNT_FIELD))
    self.assertEqual(data[PRICE_FIELD][0], get_field_empty_msg(PRICE_FIELD))
    self.assertEqual(data[QUANTITY_FIELD][0], get_field_empty_msg(QUANTITY_FIELD))
    self.assertEqual(data[PRODUCT_TYPE_FIELD][0], get_field_empty_msg(PRODUCT_TYPE_FIELD))
    self.assertEqual(data[FEATURE_VALUES_FIELD][0], get_field_empty_msg(FEATURE_VALUES_FIELD))
    self.assertEqual(data[IMAGES_FIELD][0], get_field_empty_msg(IMAGES_FIELD))

  def test_should_update_throws_no_data(self):
    product_id = 1
    response = self.send_put_request(product_id, token=self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], NO_DATA_ERR)

  def test_should_update_throws_invalid_values(self):
    product_id = 1
    data_dict = get_product_dict(INVALID_DISCOUNT, INVALID_PRICE, INVALID_QUANTITY, product_type_id=2,
                                 feature_values_ids=[1, 2], images=self.images)
    response = self.send_put_request(product_id, data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[DISCOUNT_FIELD][0], DISCOUNT_VALUE_ERR)
    self.assertEqual(data[PRICE_FIELD][0], PRICE_VALUE_ERR)
    self.assertEqual(data[QUANTITY_FIELD][0], QUANTITY_VALUE_ERR)

  def test_should_update_throws_not_int_value(self):
    product_id = 1
    data_dict = get_product_dict(discount='invalid', price='invalid', quantity='invalid', product_type_id=2,
                                 feature_values_ids=[1, 2], images=self.images)
    response = self.send_put_request(product_id, data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[DISCOUNT_FIELD][0], DISCOUNT_NOT_INT_ERR)
    self.assertEqual(data[PRICE_FIELD][0], PRICE_NOT_INT_ERR)
    self.assertEqual(data[QUANTITY_FIELD][0], QUANTITY_NOT_INT_ERR)

  def test_should_update_throws_invalid_product_type_id(self):
    product_id = 1
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, product_type_id=999,
                                 feature_values_ids=[1, 2], images=self.images)
    response = self.send_put_request(product_id, data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[PRODUCT_TYPE_FIELD][0], get_not_exist_msg(ProductType))

  def test_should_update_throws_no_such_feature_value(self):
    product_id = 1
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, product_type_id=2,
                                 feature_values_ids=[1, 2, 33], images=self.images)
    response = self.send_put_request(product_id, data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[FEATURE_VALUES_FIELD][0], get_not_exist_msg(FeatureValue))

  def test_should_update_throws_feature_values_from_the_same_feature_type(self):
    product_id = 1
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, product_type_id=2,
                                 feature_values_ids=[1, 2, 3], images=self.images)
    response = self.send_put_request(product_id, data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[FEATURE_VALUES_FIELD][0], INVALID_FEATURE_TYPE_ID_ERR)

  def test_should_update_throws_feature_values_of_another_product_type(self):
    product_id = 1
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, 2, [4], self.images)
    response = self.send_put_request(product_id, data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[FEATURE_VALUES_FIELD][0], INVALID_FEATURE_TYPE_ID_ERR)

  def test_should_update_throws_invalid_image(self):
    product_id = 1
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, product_type_id=2, feature_values_ids=[1, 2],
                                 images=['invalid image'])
    response = self.send_put_request(product_id, data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[IMAGES_FIELD][0], NOT_VALID_IMAGE)

  def test_should_delete_success(self):
    product_id = 1
    response = self.client.delete(url(product_id), HTTP_AUTHORIZATION=self.token)
    self.assertEqual(response.status_code, OK_CODE)

  def test_should_delete_throws_admin_required(self):
    product_id = 1
    response = self.client.delete(url(product_id), HTTP_AUTHORIZATION='')
    self.assertEqual(response.status_code, FORBIDDEN_CODE)

  def test_should_delete_throws_not_found(self):
    product_id = 1111
    response = self.client.delete(url(product_id), HTTP_AUTHORIZATION=self.token)
    self.assertEqual(response.status_code, NOT_FOUND_CODE)
