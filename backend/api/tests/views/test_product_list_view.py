import base64
import os

from api.models import Product, FeatureValue, ProductType
from api.tests.views.base.base_list_view_test import ListViewTestCase
from api.tests.views.constants import PRODUCT_LIST_URL
from api.tests.views.fixtures.product_list_view_fixture import ProductListViewFixture
from api.utils.errors.error_constants import GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields import DISCOUNT_FIELD, PRICE_FIELD, QUANTITY_FIELD, PRODUCT_TYPE_FIELD, \
  FEATURE_VALUES_FIELD, IMAGES_FIELD


def get_product_data(discount=None, price=None, quantity=None, product_type_id=None, feature_values_ids=None,
                     images=None):
  return {DISCOUNT_FIELD: discount, PRICE_FIELD: price, QUANTITY_FIELD: quantity, PRODUCT_TYPE_FIELD: product_type_id,
          FEATURE_VALUES_FIELD: feature_values_ids, IMAGES_FIELD: images}


class ProductListViewTest(ListViewTestCase):
  _fixtures = ListViewTestCase._fixtures + [ProductListViewFixture]

  @classmethod
  def setUpClass(cls):
    super().setUpClass()
    pwd = os.path.dirname(__file__)
    cls.images = []
    for i in range(1, 4):
      with open('{0}/assets/products_images/{1}.jpg'.format(pwd, i), 'rb') as image:
        cls.images.append('data:image/jpg;base64,%s' % base64.b64encode(image.read()).decode())
        image.close()

  def setUp(self):
    self.black_fv = FeatureValue.objects.filter(name__value='Black')[0]
    self.white_fv = FeatureValue.objects.filter(name__value='White')[0]
    self.gold_fv = FeatureValue.objects.filter(name__value='Gold')[0]
    self.fv_64GB = FeatureValue.objects.filter(name__value='64GB')[0]
    self.fv_128GB = FeatureValue.objects.filter(name__value='128GB')[0]
    self.fv_512GB = FeatureValue.objects.filter(name__value='512GB')[0]
    self.iphone7_pt = ProductType.objects.filter(name__value='Iphone 7')[0]

  def test_should_get_success(self):
    self.should_get_all_succeed(PRODUCT_LIST_URL, Product)

  def test_should_get_with_filter_succeed(self):
    url = '{0}?feature_value__in=[{1}]'.format(PRODUCT_LIST_URL, self.black_fv.id)
    self.should_get_succeed_with_filter(url, Product, {'feature_value__in': [self.black_fv.id]})

  def test_should_get_with_exclude_succeed(self):
    url = '{0}?exclude=["names"]'.format(PRODUCT_LIST_URL)
    self.should_get_succeed_with_exclude(url, Product, exclude=['names'])

  def test_should_get_with_serialized_field_succeed(self):
    url = '{0}?serialize=["feature_value"]'.format(PRODUCT_LIST_URL)
    self.should_get_succeed_with_serialize(url, Product, serialize=['feature_value'])

  def test_should_post_succeed(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=self.images)
    expected = data.copy()
    del expected[IMAGES_FIELD]
    response_data = self.should_post_succeed(PRODUCT_LIST_URL, data, self.admin_user.token, expected)
    self.assertEquals(len(response_data[IMAGES_FIELD]), len(self.images))

  def test_should_post_with_serialized_field_succeed(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=self.images)
    expected = data.copy()
    del expected[IMAGES_FIELD], expected[PRODUCT_TYPE_FIELD]
    url = '{0}?serialize=["product_type"]'.format(PRODUCT_LIST_URL)
    response_data = self.should_post_succeed(url, data, self.admin_user.token, expected)
    self.assertEquals(len(response_data[IMAGES_FIELD]), len(self.images))
    self.assertIsInstance(response_data[PRODUCT_TYPE_FIELD], dict)

  def test_should_post_require_auth(self):
    self.should_post_require_auth(PRODUCT_LIST_URL)

  def test_should_post_null_values(self):
    data = get_product_data()
    expected_content = {
      FEATURE_VALUES_FIELD: ['errors.products.feature_values.mustNotBeNull'],
      PRICE_FIELD: ['errors.products.price.mustNotBeNull'],
      DISCOUNT_FIELD: ['errors.products.discount.mustNotBeNull'],
      QUANTITY_FIELD: ['errors.products.quantity.mustNotBeNull'],
      PRODUCT_TYPE_FIELD: ['errors.products.product_type.mustNotBeNull'],
      IMAGES_FIELD: ['errors.products.images.mustNotBeNull'],
    }
    self.should_post_fail(PRODUCT_LIST_URL, data=data, expected_content=expected_content, token=self.admin_user.token)

  def test_should_post_no_data(self):
    self.should_post_fail_when_no_data_sent(PRODUCT_LIST_URL, self.admin_user.token)

  def test_should_post_no_such_feature_value(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, 999], images=self.images)
    expected_content = {GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureValue)]}
    self.should_post_fail(PRODUCT_LIST_URL, data=data, expected_content=expected_content, token=self.admin_user.token)

  def test_should_post_no_such_product_type(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=999,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=self.images)
    expected_content = {GLOBAL_ERR_KEY: [get_not_exist_msg(ProductType)]}
    self.should_post_fail(PRODUCT_LIST_URL, data=data, expected_content=expected_content, token=self.admin_user.token)

  def test_should_post_invalid_images(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=['invalid'])
    expected_content = {IMAGES_FIELD: ['errors.products.images.notValidFormat']}
    self.should_post_fail(PRODUCT_LIST_URL, data=data, expected_content=expected_content, token=self.admin_user.token)

  def test_should_post_invalid_feature_values(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_512GB.id], images=self.images)
    expected_content = {GLOBAL_ERR_KEY: ['Invalid feature values']}
    self.should_post_fail(PRODUCT_LIST_URL, data=data, expected_content=expected_content, token=self.admin_user.token)

  def test_should_post_invalid_discount_price_and_quality(self):
    data = get_product_data(discount=150, price=-10, quantity=-20, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=self.images)
    expected_content = {
      DISCOUNT_FIELD: ['errors.products.discount.between'],
      PRICE_FIELD: ['errors.products.price.min'],
      QUANTITY_FIELD: ['errors.products.quantity.min']
    }
    self.should_post_fail(PRODUCT_LIST_URL, data=data, expected_content=expected_content, token=self.admin_user.token)
