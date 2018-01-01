import base64
import os

from django.urls import reverse

from api.models import Product, FeatureValue, ProductType
from api.tests.views.base.base_list_view_test import ListViewTestCase
from api.tests.views.fixtures.product_list_view_fixture import ProductListViewFixture
from api.utils.errors.error_constants import GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from main.settings import MEDIA_ROOT

list_url = reverse('products')


def get_product_data(discount=None, price=None, quantity=None, product_type_id=None, feature_values_ids=None,
                     images=None):
  return {'discount': discount, 'price': price, 'quantity': quantity, 'product_type': product_type_id,
          'feature_values': feature_values_ids, 'images': images}


class ProductListViewTest(ListViewTestCase):
  _fixtures = ListViewTestCase._fixtures + [ProductListViewFixture]
  _rm_after = [os.path.join(MEDIA_ROOT)]

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
    self.should_get_all_succeed(list_url, Product)

  def test_should_get_with_filter_succeed(self):
    url = '{0}?feature_value__in=[{1}]'.format(list_url, self.black_fv.id)
    self.should_get_succeed_with_filter(url, Product, {'feature_value__in': [self.black_fv.id]})

  def test_should_get_with_exclude_succeed(self):
    url = '{0}?exclude=["names"]'.format(list_url)
    self.should_get_succeed_with_exclude(url, Product, exclude=['names'])

  def test_should_get_with_serialized_field_succeed(self):
    url = '{0}?serialize=["feature_value"]'.format(list_url)
    self.should_get_succeed_with_serialize(url, Product, serialize=['feature_value'])

  def test_should_post_succeed(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=self.images)
    expected = data.copy()
    del expected['images']
    response_data = self.should_post_succeed(list_url, data, self.admin_user_token, expected)
    self.assertEquals(len(response_data['images']), len(self.images))

  def test_should_post_with_serialized_field_succeed(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=self.images)
    expected = data.copy()
    del expected['images'], expected['product_type']
    url = '{0}?serialize=["product_type"]'.format(list_url)
    response_data = self.should_post_succeed(url, data, self.admin_user_token, expected)
    self.assertEquals(len(response_data['images']), len(self.images))
    self.assertIsInstance(response_data['product_type'], dict)

  def test_should_post_require_auth(self):
    self.should_post_require_auth(list_url)

  def test_should_post_null_values(self):
    data = get_product_data()
    expected_content = {
      'feature_values': ['errors.products.feature_values.mustNotBeNull'],
      'price': ['errors.products.price.mustNotBeNull'],
      'discount': ['errors.products.discount.mustNotBeNull'],
      'quantity': ['errors.products.quantity.mustNotBeNull'],
      'product_type': ['errors.products.product_type.mustNotBeNull'],
      'images': ['errors.products.images.mustNotBeNull'],
    }
    self.should_post_fail(list_url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_no_data(self):
    self.should_post_fail_when_no_data_sent(list_url, self.admin_user_token)

  def test_should_post_no_such_feature_value(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, 999], images=self.images)
    expected_content = {GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureValue)]}
    self.should_post_fail(list_url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_no_such_product_type(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=999,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=self.images)
    expected_content = {GLOBAL_ERR_KEY: [get_not_exist_msg(ProductType)]}
    self.should_post_fail(list_url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_invalid_images(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=['invalid'])
    expected_content = {'images': ['errors.products.images.notValidFormat']}
    self.should_post_fail(list_url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_invalid_feature_values(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_512GB.id], images=self.images)
    expected_content = {GLOBAL_ERR_KEY: ['Invalid feature values']}
    self.should_post_fail(list_url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_invalid_discount_price_and_quality(self):
    data = get_product_data(discount=150, price=-10, quantity=-20, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=self.images)
    expected_content = {
      'discount': ['errors.products.discount.between'],
      'price': ['errors.products.price.min'],
      'quantity': ['errors.products.quantity.min']
    }
    self.should_post_fail(list_url, data=data, expected_content=expected_content, token=self.admin_user_token)
