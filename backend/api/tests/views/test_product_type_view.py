import base64
import os

from django.urls import reverse

from api.models import ProductType, Category, FeatureValue
from api.tests.views.base.base_detail_view_test import DetailViewTestCase
from api.tests.views.fixtures.product_type_view_fixture import ProductTypeViewFixture
from api.tests.views.utils import get_intl_texts, get_intl_texts_errors
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, NOT_VALID_IMAGE
from api.utils.errors.error_messages import get_not_exist_msg
from main.settings import MEDIA_ROOT

list_url = reverse('product_types')


def get_data(name=get_intl_texts(), description=get_intl_texts(),
             short_description=get_intl_texts(),
             feature_values=None, category=None, image=None):
  return {'name': name, 'description': description, 'short_description': short_description,
          'feature_values': feature_values, 'category': category, 'image': image}


def get_image(extension='jpg'):
  pwd = os.path.dirname(__file__)
  with open('%s/assets/test_product_type_img.jpg' % pwd, 'rb') as image:
    return 'data:image/%s;base64,%s' % (extension, base64.b64encode(image.read()).decode())


class ProductTypeViewTest(DetailViewTestCase):
  _fixtures = DetailViewTestCase._fixtures + [ProductTypeViewFixture]
  _rm_after = [os.path.join(MEDIA_ROOT)]

  def setUp(self):
    self.phone_category_id = Category.objects.filter(name__value='Phone')[0].id
    self.laptop_category_id = Category.objects.filter(name__value='Laptop')[0].id

  def test_should_get_success(self):
    product_type = ProductType.objects.all()[0]
    self.should_get_by_id_succeed(list_url, ProductType, product_type.pk)

  def test_should_get_with_exclude_succeed(self):
    product_type = ProductType.objects.all()[0]
    url = '{0}/{1}?exclude=["name"]'.format(list_url, product_type.pk)
    expected = product_type.serialize(exclude=['name'])
    self.should_get_succeed(url, expected)

  def test_should_get_with_serialized_field_succeed(self):
    product_type = ProductType.objects.all()[0]
    url = '{0}/{1}?serialize=["products"]'.format(list_url, product_type.pk)
    expected = product_type.serialize(serialize=['products'])
    self.should_get_succeed(url, expected)

  def test_should_put_succeed(self):
    product_type = ProductType.objects.filter(name__value='Iphone 7')[0]
    en_name = 'New Iphone 7 name'
    en_description = 'New Iphone 7 Description'
    en_short_description = 'New Iphone 7 Short Description'
    feature_values_ids = [i.pk for i in product_type.feature_values.all()]
    data = get_data(get_intl_texts(en_name), get_intl_texts(en_description),
                    get_intl_texts(en_short_description), category=product_type.category.pk,
                    feature_values=feature_values_ids, image=get_image())
    expected = data.copy()
    del expected['image']
    expected['name'] = en_name
    expected['description'] = en_description
    expected['short_description'] = en_short_description
    url = '{0}/{1}'.format(list_url, product_type.pk)
    response_data = self.should_put_succeed(url, data, self.admin_user_token, expected)
    self.assertIsNotNone(response_data['image'])

  def test_should_put_succeed_with_serialize_and_exclude(self):
    product_type = ProductType.objects.filter(name__value='Iphone 7')[0]
    en_name = 'New Iphone 7 name'
    en_description = 'New Iphone 7 Description'
    en_short_description = 'New Iphone 7 Short Description'
    feature_values_ids = [i.pk for i in product_type.feature_values.all()]
    data = get_data(get_intl_texts(en_name), get_intl_texts(en_description),
                    get_intl_texts(en_short_description), category=product_type.category.pk,
                    feature_values=feature_values_ids, image=get_image())
    expected = data.copy()
    del expected['image']
    expected['description'] = en_description
    expected['short_description'] = en_short_description
    del expected['category']
    del expected['name']
    url = '{0}/{1}?serialize=["category"]&exclude=["name"]'.format(list_url, product_type.pk)
    response_data = self.should_put_succeed(url, data, self.admin_user_token, expected)
    self.assertIsNotNone(response_data['image'])
    self.assertIsInstance(response_data['category'], dict)

  def test_should_put_require_auth(self):
    product_type = ProductType.objects.filter(name__value='Iphone 7')[0]
    url = '{0}/{1}'.format(list_url, product_type.pk)
    self.should_put_require_auth(url)

  def test_should_put_null_values(self):
    product_type = ProductType.objects.filter(name__value='Iphone 7')[0]
    data = get_data()
    expected_content = {
      'feature_values': ['errors.productType.feature_values.mustNotBeNull'],
      'name': get_intl_texts_errors('productType', field='name'),
      'description': get_intl_texts_errors('productType', field='description'),
      'short_description': get_intl_texts_errors('productType', field='short_description'),
      'category': ['errors.productType.category.mustNotBeNull'],
      'image': ['errors.productType.image.mustNotBeNull']
    }
    url = '{0}/{1}'.format(list_url, product_type.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_no_data(self):
    product_type = ProductType.objects.filter(name__value='Iphone 7')[0]
    url = '{0}/{1}'.format(list_url, product_type.pk)
    self.should_put_fail_when_no_data_sent(url, self.admin_user_token)

  def test_should_put_empty_values(self):
    product_type = ProductType.objects.filter(name__value='Iphone 7')[0]
    data = get_data(get_intl_texts(''), get_intl_texts(''),
                    get_intl_texts(''), feature_values=[1, 2, 3, 4, 5],
                    category=self.phone_category_id, image=get_image())
    expected_content = {
      'name': get_intl_texts_errors('productType', error='mustNotBeEmpty', field='name'),
      'description': get_intl_texts_errors('productType', error='mustNotBeEmpty', field='description'),
      'short_description': get_intl_texts_errors('productType', error='mustNotBeEmpty', field='short_description'),
    }
    url = '{0}/{1}'.format(list_url, product_type.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_too_long_values(self):
    data = get_data(get_intl_texts('a' * 31), get_intl_texts('a' * 1001),
                    get_intl_texts('a' * 301), feature_values=[1, 2, 3, 4, 5, 6],
                    category=self.phone_category_id, image=get_image())
    expected_content = {
      'name': get_intl_texts_errors('productType', error='maxLength', field='name'),
      'description': get_intl_texts_errors('productType', error='maxLength', field='description'),
      'short_description': get_intl_texts_errors('productType', error='maxLength', field='short_description'),
    }
    product_type = ProductType.objects.filter(name__value='Iphone 7')[0]
    url = '{0}/{1}'.format(list_url, product_type.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_no_such_category(self):
    data = get_data(get_intl_texts('New Iphone 7 Name'), get_intl_texts('New Iphone 7 Description'),
                    get_intl_texts('New Iphone 7 Short Description'), feature_values=[1, 2, 3, 4, 5, 6],
                    category=999, image=get_image())
    expected_content = {GLOBAL_ERR_KEY: [get_not_exist_msg(Category)]}
    product_type = ProductType.objects.filter(name__value='Iphone 7')[0]
    url = '{0}/{1}'.format(list_url, product_type.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_no_such_feature_value(self):
    data = get_data(get_intl_texts('New Iphone 7 Name'), get_intl_texts('New Iphone 7 Description'),
                    get_intl_texts('New Iphone 7 Short Description'), feature_values=[999],
                    category=self.phone_category_id, image=get_image())
    expected_content = {GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureValue)]}
    product_type = ProductType.objects.filter(name__value='Iphone 7')[0]
    url = '{0}/{1}'.format(list_url, product_type.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_invalid_image(self):
    product_type = ProductType.objects.filter(name__value='Iphone 7')[0]
    feature_values_ids = [i.pk for i in product_type.feature_values.all()]
    data = get_data(get_intl_texts('New Iphone 7 Name'), get_intl_texts('New Iphone 7 Description'),
                    get_intl_texts('New Iphone 7 Short Description'), feature_values=feature_values_ids,
                    category=self.phone_category_id, image='invalid')
    expected_content = {GLOBAL_ERR_KEY: [NOT_VALID_IMAGE]}
    url = '{0}/{1}'.format(list_url, product_type.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_invalid_feature_values(self):
    product_type = ProductType.objects.filter(name__value='Iphone 7')[0]
    feature_values_ids = [i.pk for i in product_type.feature_values.all()]
    data = get_data(get_intl_texts('Macbook Pro'), get_intl_texts('Macbook Pro Description'),
                    get_intl_texts('Macbook Pro Short Description'), feature_values=feature_values_ids,
                    category=self.laptop_category_id, image=get_image())
    expected_content = {GLOBAL_ERR_KEY: ['Invalid feature values']}
    product_type = ProductType.objects.filter(name__value='Iphone 7')[0]
    url = '{0}/{1}'.format(list_url, product_type.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_delete_succeed(self):
    product_type = ProductType.objects.all()[0]
    self.should_delete_succeed(list_url, product_type.pk, self.manager_user_token)

  def test_should_delete_require_role(self):
    product_type = ProductType.objects.all()[0]
    self.should_delete_require_role(list_url, product_type.pk, self.reader_user_token)

  def test_should_delete_not_found(self):
    self.should_delete_not_found(list_url, ProductType, 999, self.manager_user_token)
