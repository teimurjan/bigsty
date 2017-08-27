import base64
import json
import os
from django.test import TestCase

from api.models import User, Product, FeatureValue, ProductType
from api.serializers import generate_token
from api.tests.views.constants import PRODUCT_LIST_URL
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, NO_DATA_ERR, DISCOUNT_VALUE_ERR, PRICE_VALUE_ERR, \
  QUANTITY_VALUE_ERR, DISCOUNT_NOT_INT_ERR, PRICE_NOT_INT_ERR, QUANTITY_NOT_INT_ERR, INVALID_FEATURE_TYPE_ID_ERR, \
  NOT_VALID_IMAGE
from api.utils.errors.error_messages import get_field_empty_msg, get_not_exist_msg
from api.utils.form_fields_constants import DISCOUNT_FIELD, PRICE_FIELD, QUANTITY_FIELD, PRODUCT_TYPE_FIELD, \
  FEATURE_VALUES_FIELD, IMAGES_FIELD, DATA_KEY
from api.utils.response_constants import OK_CODE, FORBIDDEN_CODE, BAD_REQUEST_CODE

VALID_DISCOUNT = 10
VALID_PRICE = 100
VALID_QUANTITY = 5

INVALID_DISCOUNT = 150
INVALID_PRICE = -VALID_PRICE
INVALID_QUANTITY = -VALID_QUANTITY


def get_product_dict(discount=None, price=None, quantity=None, product_type_id=None, feature_values_ids=None,
                     images=None):
  return {DISCOUNT_FIELD: discount, PRICE_FIELD: price, QUANTITY_FIELD: quantity, PRODUCT_TYPE_FIELD: product_type_id,
          FEATURE_VALUES_FIELD: feature_values_ids, IMAGES_FIELD: images}


class ProductListViewTest(TestCase):
  fixtures = ['product_list_view_test.json']

  def setUp(self):
    user = User.objects.get(pk=1)
    self.token = generate_token(user)

    pwd = os.path.dirname(__file__)
    self.images = []
    for i in range(1, 4):
      with open('%s/assets/products_images/%s.jpg' % (pwd, i), 'rb') as image:
        self.images.append('data:image/jpg;base64,%s' % base64.b64encode(image.read()).decode())

  def send_post_request(self, data_dict=None, token=None):
    return self.client.post(PRODUCT_LIST_URL, json.dumps(data_dict),
                            HTTP_AUTHORIZATION='Bearer %s' % token,
                            content_type='application/json')

  def test_should_get_success(self):
    response = self.client.get(PRODUCT_LIST_URL)
    self.assertEqual(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEqual(data, [product.to_dict() for product in Product.objects.all()])

  def test_should_post_success(self):
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, product_type_id=2,
                                 feature_values_ids=[1, 2], images=self.images)
    response = self.send_post_request(data_dict, self.token)
    self.assertEqual(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEqual(data[DISCOUNT_FIELD], data_dict[DISCOUNT_FIELD])
    self.assertEqual(data[PRICE_FIELD], data_dict[PRICE_FIELD])
    self.assertEqual(data[QUANTITY_FIELD], data_dict[QUANTITY_FIELD])
    self.assertEqual(data[PRODUCT_TYPE_FIELD], data_dict[PRODUCT_TYPE_FIELD])
    self.assertEqual(data[FEATURE_VALUES_FIELD], data_dict[FEATURE_VALUES_FIELD])
    self.assertEqual(len(data[IMAGES_FIELD]), len(data_dict[IMAGES_FIELD]))

  def test_should_throws_admin_required(self):
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, product_type_id=2,
                                 feature_values_ids=[1, 2], images=self.images)
    response = self.send_post_request(data_dict)
    self.assertEqual(response.status_code, FORBIDDEN_CODE)

  def test_should_update_throws_no_values(self):
    response = self.send_post_request({}, self.token)
    data = json.loads(response.content.decode())
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    self.assertEqual(data[DISCOUNT_FIELD][0], get_field_empty_msg(DISCOUNT_FIELD))
    self.assertEqual(data[PRICE_FIELD][0], get_field_empty_msg(PRICE_FIELD))
    self.assertEqual(data[QUANTITY_FIELD][0], get_field_empty_msg(QUANTITY_FIELD))
    self.assertEqual(data[PRODUCT_TYPE_FIELD][0], get_field_empty_msg(PRODUCT_TYPE_FIELD))
    self.assertEqual(data[FEATURE_VALUES_FIELD][0], get_field_empty_msg(FEATURE_VALUES_FIELD))
    self.assertEqual(data[IMAGES_FIELD][0], get_field_empty_msg(IMAGES_FIELD))

  def test_should_update_throws_no_data(self):
    response = self.send_post_request(token=self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[GLOBAL_ERR_KEY][0], NO_DATA_ERR)

  def test_should_update_throws_invalid_values(self):
    data_dict = get_product_dict(INVALID_DISCOUNT, INVALID_PRICE, INVALID_QUANTITY, product_type_id=2,
                                 feature_values_ids=[1, 2], images=self.images)
    response = self.send_post_request(data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[DISCOUNT_FIELD][0], DISCOUNT_VALUE_ERR)
    self.assertEqual(data[PRICE_FIELD][0], PRICE_VALUE_ERR)
    self.assertEqual(data[QUANTITY_FIELD][0], QUANTITY_VALUE_ERR)

  def test_should_update_throws_not_int_value(self):
    data_dict = get_product_dict(discount='invalid', price='invalid', quantity='invalid', product_type_id=2,
                                 feature_values_ids=[1, 2], images=self.images)
    response = self.send_post_request(data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[DISCOUNT_FIELD][0], DISCOUNT_NOT_INT_ERR)
    self.assertEqual(data[PRICE_FIELD][0], PRICE_NOT_INT_ERR)
    self.assertEqual(data[QUANTITY_FIELD][0], QUANTITY_NOT_INT_ERR)

  def test_should_update_throws_invalid_product_type_id(self):
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, product_type_id=999,
                                 feature_values_ids=[1, 2], images=self.images)
    response = self.send_post_request(data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[PRODUCT_TYPE_FIELD][0], get_not_exist_msg(ProductType))

  def test_should_update_throws_no_such_feature_value(self):
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, product_type_id=2,
                                 feature_values_ids=[1, 2, 33], images=self.images)
    response = self.send_post_request(data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[FEATURE_VALUES_FIELD][0], get_not_exist_msg(FeatureValue))

  def test_should_update_throws_feature_values_from_the_same_feature_type(self):
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, product_type_id=2,
                                 feature_values_ids=[1, 2, 3], images=self.images)
    response = self.send_post_request(data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[FEATURE_VALUES_FIELD][0], INVALID_FEATURE_TYPE_ID_ERR)

  def test_should_update_throws_feature_values_of_another_product_type(self):
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, 2, [4], self.images)
    response = self.send_post_request(data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[FEATURE_VALUES_FIELD][0], INVALID_FEATURE_TYPE_ID_ERR)

  def test_should_update_throws_invalid_image(self):
    data_dict = get_product_dict(VALID_DISCOUNT, VALID_PRICE, VALID_QUANTITY, product_type_id=2, feature_values_ids=[1, 2],
                                 images=['invalid image'])
    response = self.send_post_request(data_dict, self.token)
    self.assertEqual(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEqual(data[IMAGES_FIELD][0], NOT_VALID_IMAGE)
