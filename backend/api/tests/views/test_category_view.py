from typing import Dict, List

from django.urls import reverse

from api.models import Category, FeatureType
from api.tests.views.base.base_detail_view_test import DetailViewTestCase
from api.tests.views.fixtures.category_view_fixture import CategoryViewFixture
from api.tests.views.utils import get_intl_texts, get_intl_texts_errors
from api.utils.errors.error_constants import GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.http_constants import NOT_FOUND_CODE


def get_data(name: Dict[str, str] = None, feature_types_ids: List[int] = None):
  return {'name': name, 'feature_types': feature_types_ids}


list_url = reverse('categories')


class CategoryViewTest(DetailViewTestCase):
  _fixtures = DetailViewTestCase._fixtures + [CategoryViewFixture]

  def test_should_get_succeed(self) -> None:
    category = Category.objects.all()[0]
    self.should_get_by_id_succeed(list_url, Category, category.pk)

  def test_should_get_succeed_with_serialize(self) -> None:
    category = Category.objects.all()[0]
    expected = category.serialize(serialize=['product_types'])
    url = '{0}/{1}?serialize=["product_types"]'.format(list_url, category.pk)
    self.should_get_succeed(url, expected)

  def test_should_get_succeed_with_exclude(self) -> None:
    category = Category.objects.all()[0]
    expected = category.serialize(exclude=['product_types'])
    url = '{0}/{1}?exclude=["product_types"]'.format(list_url, category.pk)
    self.should_get_succeed(url, expected)

  def test_should_get_not_found(self) -> None:
    self.should_get_by_id_fail(list_url, Category, 999)

  def test_should_put_succeed(self):
    category = Category.objects.all()[0]
    en_name = 'New name for Phone category'
    feature_types_ids = [1]
    data = get_data(get_intl_texts(en_name), feature_types_ids=feature_types_ids)
    url = '{0}/{1}'.format(list_url, category.pk)
    expected = category.serialize()
    expected['name'] = en_name
    expected['feature_types'] = feature_types_ids
    self.should_put_succeed(url, data, self.manager_user_token, expected)

  def test_should_put_succeed_with_serialize_and_exclude(self):
    category = Category.objects.all()[0]
    en_name = 'New name for Phone category'
    data = get_data(get_intl_texts(en_name), feature_types_ids=[1, 2])
    url = '{0}/{1}?serialize=["feature_types"]&exclude=["name"]'.format(list_url, category.pk)
    expected = category.serialize(serialize=["feature_types"])
    del expected['name']
    self.should_put_succeed(url, data, self.manager_user_token, expected)

  def test_should_put_require_role(self):
    category = Category.objects.all()[0]
    url = '{0}/{1}'.format(list_url, category.pk)
    self.should_put_require_role(url, self.reader_user_token)

  def test_should_post_no_data(self) -> None:
    category = Category.objects.all()[0]
    url = '{0}/{1}'.format(list_url, category.pk)
    self.should_put_fail_when_no_data_sent(url, self.admin_user_token)

  def test_should_put_null_values(self):
    category = Category.objects.all()[0]
    data = get_data(get_intl_texts())
    url = '{0}/{1}'.format(list_url, category.pk)
    self.should_put_fail(url, data, token=self.manager_user_token, expected_content={
      'feature_types': ['errors.category.feature_types.mustNotBeNull'],
      'name': get_intl_texts_errors('category', field='name'),
    })

  def test_should_put_empty_values(self):
    category = Category.objects.all()[0]
    data = get_data(get_intl_texts(''), [])
    url = '{0}/{1}'.format(list_url, category.pk)
    self.should_put_fail(url, data, token=self.manager_user_token, expected_content={
      'name': get_intl_texts_errors('category', error='mustNotBeEmpty', field='name'),
    })

  def test_should_put_invalid_length(self):
    category = Category.objects.all()[0]
    data = get_data(get_intl_texts('a' * 31), [])
    url = '{0}/{1}'.format(list_url, category.pk)
    self.should_put_fail(url, data, token=self.manager_user_token, expected_content={
      'name': get_intl_texts_errors('category', error='maxLength', field='name'),
    })

  def test_should_put_invalid_feature_type(self):
    category = Category.objects.all()[0]
    data = get_data(get_intl_texts('New name'), [999])
    url = '{0}/{1}'.format(list_url, category.pk)
    self.should_put_fail(url, data, token=self.manager_user_token, expected_content={
      GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureType)]
    })

  def test_should_put_invalid_category(self):
    data = get_data(get_intl_texts('New name'), [1])
    url = '{0}/{1}'.format(list_url, 999)
    self.should_put_fail(url, data, token=self.manager_user_token, expected_content={
      GLOBAL_ERR_KEY: [get_not_exist_msg(Category)]
    }, expected_code=NOT_FOUND_CODE)

  def test_should_delete_succeed(self):
    category = Category.objects.all()[0]
    self.should_delete_succeed(list_url, category.pk, self.manager_user_token)

  def test_should_delete_require_role(self):
    category = Category.objects.all()[0]
    self.should_delete_require_role(list_url, category.pk, self.reader_user_token)

  def test_should_delete_not_found(self):
    self.should_delete_not_found(list_url, Category, 999, self.manager_user_token)
