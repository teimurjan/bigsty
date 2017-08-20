import base64
import json
import os
from django.test import TestCase

from api.models import User, Product
from api.serializers import generate_token
from api.tests.views.constants import PRODUCT_LIST_URL
from api.utils.form_fields_constants import DISCOUNT_FIELD, PRICE_FIELD, QUANTITY_FIELD, PRODUCT_TYPE_FIELD, \
  FEATURE_VALUES_FIELD, IMAGES_FIELD, DATA_KEY
from api.utils.response_constants import OK_CODE


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

  def test_should_get_success(self):
    response = self.client.get(PRODUCT_LIST_URL)
    self.assertEqual(response.status_code, OK_CODE)
    data = json.loads(response.content.decode())[DATA_KEY]
    self.assertEqual(data, [product.to_dict() for product in Product.objects.all()])
