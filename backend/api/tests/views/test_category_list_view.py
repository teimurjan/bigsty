from typing import List, Dict

from django.urls import reverse

from api.models import Category, FeatureType
from api.tests.views.base.base_list_view_test import ListViewTestCase
from api.tests.views.fixtures.category_list_view_fixture import CategoryListViewFixture
from api.tests.views.utils import get_intl_texts_errors
from api.utils.errors.error_constants import GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg


def get_name(en_name=None):
  return {'en': en_name}


def get_data(name: Dict[str, str] = get_name(), feature_types_ids: List[int] = None) -> dict:
  return {'name': name, 'feature_types': feature_types_ids}


list_url = reverse('categories')


class CategoryListViewTest(ListViewTestCase):
  _fixtures = ListViewTestCase._fixtures + [CategoryListViewFixture]

  def test_should_get_succeed(self) -> None:
    self.should_get_all_succeed(list_url, Category)

  def test_should_get_with_filter_succeed(self) -> None:
    url = '{0}?feature_type__in=[2]'.format(list_url)
    self.should_get_succeed_with_filter(url, Category, {'feature_type__in': [2]})

  def test_should_get_with_serialized_field_succeed(self) -> None:
    url = '{0}?serialize=["feature_types"]'.format(list_url)
    self.should_get_succeed_with_serialize(url, Category, serialize=['feature_types'])

  def test_should_get_with_exclude_succeed(self) -> None:
    url = '{0}?exclude=["feature_types"]'.format(list_url)
    self.should_get_succeed_with_exclude(url, Category, exclude=['feature_types'])

  def test_should_post_succeed(self) -> None:
    name = 'Tablet'
    data = get_data(get_name(name), feature_types_ids=[1, 2])
    expected = data.copy()
    expected.update(name=name)
    self.should_post_succeed(list_url, data, self.admin_user_token, expected)

  def test_should_post_with_serialized_field_succeed(self) -> None:
    name = 'Tablet'
    data = get_data(get_name(name), feature_types_ids=[1, 2])
    expected = data.copy()
    expected.update(name=name)
    del expected['feature_types']
    url = '{0}?serialize=["feature_types"]'.format(list_url)
    response_data = self.should_post_succeed(url, data, self.admin_user_token, expected)
    self.assertIsInstance(response_data['feature_types'][0], dict)

  def test_should_post_require_auth(self) -> None:
    self.should_post_require_auth(list_url)

  def test_should_post_null_values(self) -> None:
    data = get_data()
    expected_content = {
      'name': get_intl_texts_errors('categories'),
      'feature_types': ['errors.categories.feature_types.mustNotBeNull']
    }
    self.should_post_fail(list_url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_empty_values(self) -> None:
    data = get_data(get_name(''), [])
    expected_content = {
      'name': get_intl_texts_errors('categories', 'mustNotBeEmpty'),
    }
    self.should_post_fail(list_url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_no_data(self) -> None:
    self.should_post_fail_when_no_data_sent(list_url, self.admin_user_token)

  def test_should_post_no_such_feature_type(self) -> None:
    name = 'Tablet'
    data = get_data(get_name(name), feature_types_ids=[23])
    expected_content = {GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureType)]}
    self.should_post_fail(list_url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_post_throws_invalid_length(self) -> None:
    data = {'name': get_name('a' * 31)}
    expected_content = {
      'name': get_intl_texts_errors('categories', 'maxLength'),
      'feature_types': ['errors.categories.feature_types.required']
    }
    self.should_post_fail(list_url, data=data, expected_content=expected_content,
                          token=self.admin_user_token)
