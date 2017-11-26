from api.models import FeatureValue, FeatureType
from api.tests.views.base.base_list_view_test import ListViewTestCase
from api.tests.views.constants import FEATURE_VALUE_LIST_URL
from api.tests.views.fixtures.feature_value_list_view_fixture import FeatureValueListViewFixture
from api.tests.views.utils import get_intl_texts, get_intl_texts_errors
from api.utils.errors.error_constants import GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields import NAME_FIELD, FEATURE_TYPE_FIELD


class FeatureValueListViewTest(ListViewTestCase):
  _fixtures = ListViewTestCase._fixtures + [FeatureValueListViewFixture]

  def test_should_get_succeed(self):
    self.should_get_all_succeed(FEATURE_VALUE_LIST_URL, FeatureValue)

  def test_should_get_with_filter_succeed(self):
    url = '{0}?feature_type__in=[1]'.format(FEATURE_VALUE_LIST_URL)
    self.should_get_succeed_with_filter(url, FeatureValue, {'feature_type__in': [1]})

  def test_should_get_with_exclude_succeed(self):
    url = '{0}?exclude=["names"]'.format(FEATURE_VALUE_LIST_URL)
    self.should_get_succeed_with_exclude(url, FeatureValue, exclude=['names'])

  def test_should_get_with_serialized_field_succeed(self):
    url = '{0}?serialize=["feature_type"]'.format(FEATURE_VALUE_LIST_URL)
    self.should_get_succeed_with_serialize(url, FeatureValue, serialize=['feature_type'])

  def test_should_post_succeed(self):
    name = 'Test Feature Value'
    data = {NAME_FIELD: get_intl_texts(name), FEATURE_TYPE_FIELD: 1}
    expected = {NAME_FIELD: name, FEATURE_TYPE_FIELD: 1}
    self.should_post_succeed(FEATURE_VALUE_LIST_URL, data, self.admin_user.token, expected)

  def test_should_post_require_auth(self):
    self.should_post_require_auth(FEATURE_VALUE_LIST_URL)

  def test_should_post_null_values(self):
    data = {NAME_FIELD: get_intl_texts(), FEATURE_TYPE_FIELD: None}
    expected_content = {
      NAME_FIELD: get_intl_texts_errors('featureValues'),
      FEATURE_TYPE_FIELD: ['errors.featureValues.feature_type.mustNotBeNull']
    }
    self.should_post_fail(FEATURE_VALUE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)

  def test_should_post_empty_values(self):
    data = {NAME_FIELD: get_intl_texts(''), FEATURE_TYPE_FIELD: ''}
    expected_content = {
      NAME_FIELD: get_intl_texts_errors('featureValues', 'mustNotBeEmpty'),
      FEATURE_TYPE_FIELD: ['errors.featureValues.feature_type.mustBeInteger'],
    }
    self.should_post_fail(FEATURE_VALUE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)

  def test_should_post_no_data(self):
    self.should_post_fail_when_no_data_sent(FEATURE_VALUE_LIST_URL, self.admin_user.token)

  def test_should_post_throws_invalid_length(self):
    data = {NAME_FIELD: get_intl_texts('a' * 31), FEATURE_TYPE_FIELD: 1}
    expected_content = {
      NAME_FIELD: get_intl_texts_errors('featureValues', 'maxLength'),
    }
    self.should_post_fail(FEATURE_VALUE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)

  def test_should_post_throws_invalid_feature_type(self):
    data = {NAME_FIELD: get_intl_texts('Test Name'), FEATURE_TYPE_FIELD: 999}
    expected_content = {
      GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureType)],
    }
    self.should_post_fail(FEATURE_VALUE_LIST_URL, data=data, expected_content=expected_content,
                          token=self.admin_user.token)
