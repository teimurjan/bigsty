from api.models import FeatureType
from api.tests.views.base.base_list_view_test import ListViewTestCase
from api.tests.views.constants import FEATURE_TYPE_LIST_URL
from api.tests.views.fixtures.feature_type_list_view_fixture import FeatureTypeListViewFixture
from api.tests.views.utils import get_intl_texts_errors, get_intl_texts
from api.utils.form_fields import NAME_FIELD


class FeatureTypeListViewTest(ListViewTestCase):
  _fixtures = ListViewTestCase._fixtures + [FeatureTypeListViewFixture]

  def test_should_get_succeed(self):
    self.should_get_all_succeed(FEATURE_TYPE_LIST_URL, FeatureType)

  def test_should_get_with_filter_succeed(self):
    url = '{0}?categories__in=[1]'.format(FEATURE_TYPE_LIST_URL)
    self.should_get_succeed_with_filter(url, FeatureType, {'categories__in': [1]})

  def test_should_get_with_exclude_succeed(self):
    url = '{0}?exclude=["categories"]'.format(FEATURE_TYPE_LIST_URL)
    self.should_get_succeed_with_exclude(url, FeatureType, exclude=['categories'])

  def test_should_get_with_serialized_field_succeed(self):
    url = '{0}?serialize=["categories"]'.format(FEATURE_TYPE_LIST_URL)
    self.should_get_succeed_with_serialize(url, FeatureType, serialize=['categories'])

  def test_should_post_succeed(self):
    name = 'Test Feature'
    data = {NAME_FIELD: get_intl_texts(name)}
    expected = {NAME_FIELD: name}
    self.should_post_succeed(FEATURE_TYPE_LIST_URL, data, self.admin_user.token, expected)

  def test_should_post_require_auth(self):
    self.should_post_require_auth(FEATURE_TYPE_LIST_URL)

  def test_should_post_null_values(self):
    data = {NAME_FIELD: get_intl_texts()}
    expected_content = {
      NAME_FIELD: get_intl_texts_errors('featureTypes'),
    }
    self.should_post_fail(FEATURE_TYPE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)

  def test_should_post_empty_values(self):
    data = {NAME_FIELD: get_intl_texts('')}
    expected_content = {
      NAME_FIELD: get_intl_texts_errors('featureTypes', 'mustNotBeEmpty'),
    }
    self.should_post_fail(FEATURE_TYPE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)

  def test_should_post_no_data(self):
    self.should_post_fail_when_no_data_sent(FEATURE_TYPE_LIST_URL, self.admin_user.token)

  def test_should_post_throws_invalid_length(self):
    data = {NAME_FIELD: get_intl_texts('a' * 31)}
    expected_content = {
      NAME_FIELD: get_intl_texts_errors('featureTypes', 'maxLength'),
    }
    self.should_post_fail(FEATURE_TYPE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)
