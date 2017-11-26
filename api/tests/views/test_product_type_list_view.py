import base64
import os

from api.models import ProductType, FeatureValue, Category
from api.tests.views.base.base_list_view_test import ListViewTestCase
from api.tests.views.constants import PRODUCT_TYPE_LIST_URL
from api.tests.views.fixtures.product_type_list_view_fixture import ProductTypeListViewFixture
from api.tests.views.utils import get_intl_texts_errors, get_intl_texts
from api.utils.errors.error_constants import NOT_VALID_IMAGE, GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields import NAME_FIELD, DESCRIPTION_FIELD, SHORT_DESCRIPTION_FIELD, \
  FEATURE_VALUES_FIELD, CATEGORY_FIELD, IMAGE_FIELD


def get_product_type_data(name=get_intl_texts(), description=get_intl_texts(), short_description=get_intl_texts(),
                          feature_values=None, category=None, image=None) -> dict:
  return {NAME_FIELD: name, DESCRIPTION_FIELD: description, SHORT_DESCRIPTION_FIELD: short_description,
          FEATURE_VALUES_FIELD: feature_values, CATEGORY_FIELD: category, IMAGE_FIELD: image}


def get_image(extension='jpg') -> str:
  pwd = os.path.dirname(__file__)
  with open('%s/assets/test_product_type_img.jpg' % pwd, 'rb') as image:
    return 'data:image/%s;base64,%s' % (extension, base64.b64encode(image.read()).decode())


class ProductTypeListViewTest(ListViewTestCase):
  _fixtures = ListViewTestCase._fixtures + [ProductTypeListViewFixture]

  def test_should_get_success(self):
    self.should_get_all_succeed(PRODUCT_TYPE_LIST_URL, ProductType)

  def test_should_get_with_filter_succeed(self):
    url = '{0}?feature_value__in=[1]'.format(PRODUCT_TYPE_LIST_URL)
    self.should_get_succeed_with_filter(url, ProductType, {'feature_value__in': [1]})

  def test_should_get_with_exclude_succeed(self):
    url = '{0}?exclude=["names"]'.format(PRODUCT_TYPE_LIST_URL)
    self.should_get_succeed_with_exclude(url, ProductType, exclude=['names'])

  def test_should_get_with_serialized_field_succeed(self):
    url = '{0}?serialize=["feature_value"]'.format(PRODUCT_TYPE_LIST_URL)
    self.should_get_succeed_with_serialize(url, ProductType, serialize=['feature_value'])

  def test_should_post_succeed(self):
    en_name = 'Iphone 8'
    en_description = 'Iphone 8 Description'
    en_short_description = 'Iphone 8 Short Description'
    data = get_product_type_data(get_intl_texts(en_name), get_intl_texts(en_description),
                                 get_intl_texts(en_short_description), feature_values=[1, 2, 3, 4, 5, 6],
                                 category=1, image=get_image())
    expected = data.copy()
    del expected[IMAGE_FIELD]
    expected[NAME_FIELD] = en_name
    expected[DESCRIPTION_FIELD] = en_description
    expected[SHORT_DESCRIPTION_FIELD] = en_short_description
    response_data = self.should_post_succeed(PRODUCT_TYPE_LIST_URL, data, self.admin_user.token, expected)
    self.assertIsNotNone(response_data[IMAGE_FIELD])

  def test_should_post_with_serialized_field_succeed(self):
    en_name = 'Iphone 8'
    en_description = 'Iphone 8 Description'
    en_short_description = 'Iphone 8 Short Description'
    data = get_product_type_data(get_intl_texts(en_name), get_intl_texts(en_description),
                                 get_intl_texts(en_short_description), feature_values=[1, 2, 3, 4, 5, 6],
                                 category=1, image=get_image())
    expected = data.copy()
    del expected[IMAGE_FIELD], expected[CATEGORY_FIELD]
    expected[NAME_FIELD] = en_name
    expected[DESCRIPTION_FIELD] = en_description
    expected[SHORT_DESCRIPTION_FIELD] = en_short_description
    url = '{0}?serialize=["category"]'.format(PRODUCT_TYPE_LIST_URL)
    response_data = self.should_post_succeed(url, data, self.admin_user.token, expected)
    self.assertIsNotNone(response_data[IMAGE_FIELD])
    self.assertIsInstance(response_data[CATEGORY_FIELD], dict)

  def test_should_post_require_auth(self):
    self.should_post_require_auth(PRODUCT_TYPE_LIST_URL)

  def test_should_post_null_values(self):
    data = get_product_type_data()
    expected_content = {
      FEATURE_VALUES_FIELD: ['errors.productTypes.feature_values.mustNotBeNull'],
      NAME_FIELD: get_intl_texts_errors('productTypes', field='name'),
      DESCRIPTION_FIELD: get_intl_texts_errors('productTypes', field='description'),
      SHORT_DESCRIPTION_FIELD: get_intl_texts_errors('productTypes', field='short_description'),
      CATEGORY_FIELD: ['errors.productTypes.category.mustNotBeNull'],
      IMAGE_FIELD: ['errors.productTypes.image.mustNotBeNull']
    }
    self.should_post_fail(PRODUCT_TYPE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)

  def test_should_post_no_data(self):
    self.should_post_fail_when_no_data_sent(PRODUCT_TYPE_LIST_URL, self.admin_user.token)

  def test_should_post_empty_values(self):
    data = get_product_type_data(get_intl_texts(''), get_intl_texts(''),
                                 get_intl_texts(''), feature_values=[1, 2, 3, 4, 5, 6],
                                 category=1, image=get_image())
    expected_content = {
      NAME_FIELD: get_intl_texts_errors('productTypes', error='mustNotBeEmpty', field='name'),
      DESCRIPTION_FIELD: get_intl_texts_errors('productTypes', error='mustNotBeEmpty', field='description'),
      SHORT_DESCRIPTION_FIELD: get_intl_texts_errors('productTypes', error='mustNotBeEmpty', field='short_description'),
    }
    self.should_post_fail(PRODUCT_TYPE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)

  def test_should_post_too_long_values(self):
    data = get_product_type_data(get_intl_texts('a'*31), get_intl_texts('a'*1001),
                                 get_intl_texts('a'*301), feature_values=[1, 2, 3, 4, 5, 6],
                                 category=1, image=get_image())
    expected_content = {
      NAME_FIELD: get_intl_texts_errors('productTypes', error='maxLength', field='name'),
      DESCRIPTION_FIELD: get_intl_texts_errors('productTypes', error='maxLength', field='description'),
      SHORT_DESCRIPTION_FIELD: get_intl_texts_errors('productTypes', error='maxLength', field='short_description'),
    }
    self.should_post_fail(PRODUCT_TYPE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)

  def test_should_post_no_such_category(self):
    data = get_product_type_data(get_intl_texts('Iphone 8'), get_intl_texts('Iphone 8 Description'),
                                 get_intl_texts('Iphone 8 Short Description'), feature_values=[1, 2, 3, 4, 5, 6],
                                 category=999, image=get_image())
    expected_content = {GLOBAL_ERR_KEY: [get_not_exist_msg(Category)]}
    self.should_post_fail(PRODUCT_TYPE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)

  def test_should_post_no_such_feature_value(self):
    data = get_product_type_data(get_intl_texts('Iphone 8'), get_intl_texts('Iphone 8 Description'),
                                 get_intl_texts('Iphone 8 Short Description'), feature_values=[1, 2, 3, 4, 5, 999],
                                 category=1, image=get_image())
    expected_content = {GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureValue)]}
    self.should_post_fail(PRODUCT_TYPE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)

  def test_should_post_invalid_image(self):
    data = get_product_type_data(get_intl_texts('Iphone 8'), get_intl_texts('Iphone 8 Description'),
                                 get_intl_texts('Iphone 8 Short Description'), feature_values=[1, 2, 3, 4, 5, 6],
                                 category=1, image='invalid')
    expected_content = {GLOBAL_ERR_KEY: [NOT_VALID_IMAGE]}
    self.should_post_fail(PRODUCT_TYPE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)

  def test_should_post_invalid_feature_values(self):
    data = get_product_type_data(get_intl_texts('Macbook Pro'), get_intl_texts('Macbook Pro Description'),
                                 get_intl_texts('Macbook Pro Short Description'), feature_values=[1, 2, 3, 4, 5, 6],
                                 category=2, image=get_image())
    expected_content = {GLOBAL_ERR_KEY: ['Invalid feature values']}
    self.should_post_fail(PRODUCT_TYPE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)
