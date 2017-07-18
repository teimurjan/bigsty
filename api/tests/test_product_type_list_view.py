import base64
import json
import os

from django.test import TestCase

from api.models import User, ProductType, FeatureValue, Category
from api.serializers import generate_token
from api.tests.constants import PRODUCT_TYPE_LIST_URL, CATEGORY_LIST_URL
from api.utils.errors.error_constants import NOT_VALID_IMAGE
from api.utils.errors.error_messages import get_field_empty_msg, get_not_exist_msg
from api.utils.form_fields_constants import DATA_KEY, NAME_FIELD, DESCRIPTION_FIELD, SHORT_DESCRIPTION_FIELD, \
  FEATURE_VALUES_FIELD, CATEGORY_FIELD, IMAGE_FIELD
from api.utils.response_constants import OK_CODE, FORBIDDEN_CODE, BAD_REQUEST_CODE


def get_product_type_dict(name=None, description=None, short_description=None, feature_values=None, category=None,
                          image=None):
  return {NAME_FIELD: name, DESCRIPTION_FIELD: description, SHORT_DESCRIPTION_FIELD: short_description,
          FEATURE_VALUES_FIELD: feature_values, CATEGORY_FIELD: category, IMAGE_FIELD: image}


class ProductTypeListViewTest(TestCase):
  fixtures = ['product_type_list_view_test.json']

  def setUp(self):
    user = User.objects.get(pk=1)
    self.token = generate_token(user)

  def send_post_request(self, data_dict, token=None):
    return self.client.post(PRODUCT_TYPE_LIST_URL,
                            data=json.dumps(data_dict),
                            HTTP_AUTHORIZATION='Bearer %s' % token,
                            content_type='application/json')

  def test_should_get_success(self):
    response = self.client.get(PRODUCT_TYPE_LIST_URL)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())
    product_types = data[DATA_KEY]
    product_types_from_db = [product_type.to_dict() for product_type in ProductType.objects.all()]
    self.assertEquals(product_types, product_types_from_db)

  def test_should_get_with_category_filter(self):
    category_id = 2
    response = self.client.get('%s/%s/products' % (CATEGORY_LIST_URL, category_id))
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())
    product_types = data[DATA_KEY]
    product_types_from_db = [product_type.to_dict() for product_type in
                             ProductType.objects.filter(category_id=category_id)]
    self.assertEquals(product_types, product_types_from_db)

  def test_should_post_success(self):
    pwd = os.path.dirname(__file__)
    with open('%s/assets/test.jpg' % pwd, 'rb') as image:
      base64image = 'data:image/jpg;base64,%s' % base64.b64encode(image.read()).decode()
    data_dict = get_product_type_dict('Name', 'Description', 'Short description', [1, 2], 1, base64image)
    response = self.send_post_request(data_dict, self.token)
    self.assertEquals(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEquals(data_dict[NAME_FIELD], data[NAME_FIELD])
    self.assertEquals(data_dict[DESCRIPTION_FIELD], data[DESCRIPTION_FIELD])
    self.assertEquals(data_dict[SHORT_DESCRIPTION_FIELD], data[SHORT_DESCRIPTION_FIELD])
    self.assertEquals(data_dict[FEATURE_VALUES_FIELD], data[FEATURE_VALUES_FIELD])
    self.assertEquals(data_dict[CATEGORY_FIELD], data[CATEGORY_FIELD])

  def test_should_post_throw_admin_required(self):
    data_dict = get_product_type_dict('Name', 'Description', 'Short description', [1, 2], 1)
    response = self.send_post_request(data_dict)
    self.assertEquals(response.status_code, FORBIDDEN_CODE)

  def test_should_post_throw_no_values(self):
    data_dict = get_product_type_dict()
    response = self.send_post_request(data_dict, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    for k, v in data.items():
      self.assertEquals(v[0], get_field_empty_msg(k)) if k != 'global' else self.assertEquals(len(v), 0)

  def test_should_post_throw_invalid_image(self):
    data_dict = get_product_type_dict('Name', 'Description', 'Short description', [1, 2], 1, 'Invalid')
    response = self.send_post_request(data_dict, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[IMAGE_FIELD][0], NOT_VALID_IMAGE)

  def test_should_post_throw_invalid_image_type(self):
    pwd = os.path.dirname(__file__)
    with open('%s/assets/test.jpg' % pwd, 'rb') as image:
      invalid_type_bas64 = 'data:image/txt;base64,%s' % base64.b64encode(image.read()).decode()
    data_dict = get_product_type_dict('Name', 'Description', 'Short description', [1, 2], 1, invalid_type_bas64)
    response = self.send_post_request(data_dict, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[IMAGE_FIELD][0], NOT_VALID_IMAGE)

  def test_should_post_throw_no_such_feature_type(self):
    pwd = os.path.dirname(__file__)
    with open('%s/assets/test.jpg' % pwd, 'rb') as image:
      base64image = 'data:image/jpg;base64,%s' % base64.b64encode(image.read()).decode()
    data_dict = get_product_type_dict('Name', 'Description', 'Short description', [11, 2], 1, base64image)
    response = self.send_post_request(data_dict, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[FEATURE_VALUES_FIELD][0], get_not_exist_msg(FeatureValue))

  def test_should_post_throw_no_such_category(self):
    pwd = os.path.dirname(__file__)
    with open('%s/assets/test.jpg' % pwd, 'rb') as image:
      base64image = 'data:image/jpg;base64,%s' % base64.b64encode(image.read()).decode()
    data_dict = get_product_type_dict('Name', 'Description', 'Short description', [1, 2], 11, base64image)
    response = self.send_post_request(data_dict, self.token)
    self.assertEquals(response.status_code, BAD_REQUEST_CODE)
    data = json.loads(response.content.decode())
    self.assertEquals(data[CATEGORY_FIELD][0], get_not_exist_msg(Category))
