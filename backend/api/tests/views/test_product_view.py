import base64
import os

from django.urls import reverse

from api.models import Product, ProductType, FeatureValue, ProductImage
from api.tests.views.base.base_detail_view_test import DetailViewTestCase
from api.tests.views.fixtures.product_view_fixture import ProductViewFixture
from api.utils.errors.error_constants import GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields import IMAGES_FIELD, QUANTITY_FIELD, PRICE_FIELD, DISCOUNT_FIELD, \
  PRODUCT_TYPE_FIELD, FEATURE_VALUES_FIELD, ID_FIELD
from api.utils.image_utils import base64_to_image
from main.settings import MEDIA_ROOT

list_url = reverse('products')


def get_product_data(discount=None, price=None, quantity=None, product_type_id=None, feature_values_ids=None,
                     images=None):
  return {DISCOUNT_FIELD: discount, PRICE_FIELD: price, QUANTITY_FIELD: quantity, PRODUCT_TYPE_FIELD: product_type_id,
          FEATURE_VALUES_FIELD: feature_values_ids, IMAGES_FIELD: images}


class ProductViewTest(DetailViewTestCase):
  _fixtures = DetailViewTestCase._fixtures + [ProductViewFixture]
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
    product = Product.objects.all()[0]
    self.should_get_by_id_succeed(list_url, Product, product.pk)

  def test_should_get_with_exclude_and_serialize_succeed(self):
    product = Product.objects.all()[0]
    url = '{0}/{1}?exclude=["discount"]&serialize=["product_type"]'.format(list_url, product.pk)
    expected = product.serialize(exclude=['discount'], serialize=["product_type"])
    self.should_get_succeed(url, expected)

  def test_should_put_succeed(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=self.images)
    product = Product.objects.all()[0]
    url = '{0}/{1}'.format(list_url, product.pk)
    expected = data.copy()
    del expected[IMAGES_FIELD]
    response_data = self.should_put_succeed(url, data, self.admin_user_token, expected)
    self.assertEquals(len(response_data[IMAGES_FIELD]), len(self.images))

  def test_should_put_succeed_with_old_images(self):
    product = Product.objects.all()[0]
    product.images.set(
      [ProductImage.objects.create(file=base64_to_image(image, product.product_type.__str__()), product=product) for
       image in self.images])
    old_images = product.serialize(serialize=["images"])[IMAGES_FIELD]
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=old_images)
    url = '{0}/{1}'.format(list_url, product.pk)
    expected = data.copy()
    expected[IMAGES_FIELD] = [i[ID_FIELD] for i in old_images]
    self.should_put_succeed(url, data, self.admin_user_token, expected)

  def test_should_put_with_serialize_and_exclude(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=self.images)
    product = Product.objects.all()[0]
    url = '{0}/{1}?exclude=["discount"]&serialize=["product_type"]'.format(list_url, product.pk)
    expected = data.copy()
    del expected[IMAGES_FIELD], expected[DISCOUNT_FIELD], expected[PRODUCT_TYPE_FIELD]
    response_data = self.should_put_succeed(url, data, self.admin_user_token, expected)
    self.assertEquals(len(response_data[IMAGES_FIELD]), len(self.images))
    self.assertIsInstance(response_data[PRODUCT_TYPE_FIELD], dict)

  def test_should_put_require_auth(self):
    product = Product.objects.all()[0]
    url = '{0}/{1}'.format(list_url, product.pk)
    self.should_put_require_auth(url)

  def test_should_put_null_values(self):
    data = get_product_data()
    expected_content = {
      FEATURE_VALUES_FIELD: ['errors.product.feature_values.mustNotBeNull'],
      PRICE_FIELD: ['errors.product.price.mustNotBeNull'],
      DISCOUNT_FIELD: ['errors.product.discount.mustNotBeNull'],
      QUANTITY_FIELD: ['errors.product.quantity.mustNotBeNull'],
      PRODUCT_TYPE_FIELD: ['errors.product.product_type.mustNotBeNull'],
      IMAGES_FIELD: ['errors.product.images.mustNotBeNull'],
    }
    product = Product.objects.all()[0]
    url = '{0}/{1}'.format(list_url, product.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_no_data(self):
    product = Product.objects.all()[0]
    url = '{0}/{1}'.format(list_url, product.pk)
    self.should_put_fail_when_no_data_sent(url, self.admin_user_token)

  def test_should_put_no_such_feature_value(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, 999], images=self.images)
    expected_content = {GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureValue)]}
    product = Product.objects.all()[0]
    url = '{0}/{1}'.format(list_url, product.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_no_such_product_type(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=999,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=self.images)
    expected_content = {GLOBAL_ERR_KEY: [get_not_exist_msg(ProductType)]}
    product = Product.objects.all()[0]
    url = '{0}/{1}'.format(list_url, product.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_invalid_images(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=['invalid'])
    expected_content = {IMAGES_FIELD: ['errors.product.images.notValidFormat']}
    product = Product.objects.all()[0]
    url = '{0}/{1}'.format(list_url, product.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_invalid_feature_values(self):
    data = get_product_data(discount=0, price=250, quantity=5, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_512GB.id], images=self.images)
    expected_content = {GLOBAL_ERR_KEY: ['Invalid feature values']}
    product = Product.objects.all()[0]
    url = '{0}/{1}'.format(list_url, product.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_invalid_discount_price_and_quality(self):
    data = get_product_data(discount=150, price=-10, quantity=-20, product_type_id=self.iphone7_pt.id,
                            feature_values_ids=[self.gold_fv.id, self.fv_128GB.id], images=self.images)
    expected_content = {
      DISCOUNT_FIELD: ['errors.product.discount.between'],
      PRICE_FIELD: ['errors.product.price.min'],
      QUANTITY_FIELD: ['errors.product.quantity.min']
    }
    product = Product.objects.all()[0]
    url = '{0}/{1}'.format(list_url, product.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_delete_succeed(self):
    product = Product.objects.all()[0]
    self.should_delete_succeed(list_url, product.pk, self.manager_user_token)

  def test_should_delete_require_role(self):
    product = Product.objects.all()[0]
    self.should_delete_require_role(list_url, product.pk, self.reader_user_token)

  def test_should_delete_not_found(self):
    self.should_delete_not_found(list_url, Product, 999, self.manager_user_token)
