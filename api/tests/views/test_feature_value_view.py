from api.models import FeatureValue, FeatureType
from api.tests.views.base.base_detail_view_test import DetailViewTestCase
from api.tests.views.constants import FEATURE_VALUE_LIST_URL
from api.tests.views.fixtures.feature_value_view_fixture import FeatureValueViewFixture
from api.tests.views.utils import get_intl_texts, get_intl_texts_errors
from api.utils.errors.error_constants import GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields import NAME_FIELD, FEATURE_TYPE_FIELD
from api.utils.http_constants import NOT_FOUND_CODE


class FeatureValueViewTest(DetailViewTestCase):
  _fixtures = DetailViewTestCase._fixtures + [FeatureValueViewFixture]

  def test_should_get_succeed(self):
    feature_value = FeatureValue.objects.all()[0]
    self.should_get_by_id_succeed(FEATURE_VALUE_LIST_URL, FeatureValue, feature_value.pk)

  def test_should_get_succeed_with_serialize(self) -> None:
    feature_value = FeatureValue.objects.all()[0]
    expected = feature_value.serialize(serialize=['feature_type'])
    url = '{0}/{1}?serialize=["feature_type"]'.format(FEATURE_VALUE_LIST_URL, feature_value.pk)
    self.should_get_succeed(url, expected)

  def test_should_get_succeed_with_exclude(self) -> None:
    feature_value = FeatureValue.objects.all()[0]
    expected = feature_value.serialize(exclude=['feature_type'])
    url = '{0}/{1}?exclude=["feature_type"]'.format(FEATURE_VALUE_LIST_URL, feature_value.pk)
    self.should_get_succeed(url, expected)

  def test_should_get_not_found(self) -> None:
    self.should_get_by_id_fail(FEATURE_VALUE_LIST_URL, FeatureValue, 999)

  def test_should_put_succeed(self):
    feature_value = FeatureValue.objects.all()[0]
    name = '4 inches'
    data = {NAME_FIELD: get_intl_texts(name), FEATURE_TYPE_FIELD: 2}
    expected = data.copy()
    expected[NAME_FIELD] = name
    url = '{0}/{1}'.format(FEATURE_VALUE_LIST_URL, feature_value.pk)
    self.should_put_succeed(url, data, self.admin_user.token, expected)

  def test_should_put_require_role(self):
    feature_value = FeatureValue.objects.all()[0]
    url = '{0}/{1}'.format(FEATURE_VALUE_LIST_URL, feature_value.pk)
    self.should_put_require_role(url, self.reader_user.token)

  def test_should_put_null_values(self):
    feature_value = FeatureValue.objects.all()[0]
    data = {NAME_FIELD: get_intl_texts(), FEATURE_TYPE_FIELD: None}
    expected_content = {
      NAME_FIELD: get_intl_texts_errors('featureValue'),
      FEATURE_TYPE_FIELD: ['errors.featureValue.feature_type.mustNotBeNull']
    }
    url = '{0}/{1}'.format(FEATURE_VALUE_LIST_URL, feature_value.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user.token)

  def test_should_put_empty_values(self):
    feature_value = FeatureValue.objects.all()[0]
    data = {NAME_FIELD: get_intl_texts(''), FEATURE_TYPE_FIELD: ''}
    expected_content = {
      NAME_FIELD: get_intl_texts_errors('featureValue', 'mustNotBeEmpty'),
      FEATURE_TYPE_FIELD: ['errors.featureValue.feature_type.mustBeInteger'],
    }
    url = '{0}/{1}'.format(FEATURE_VALUE_LIST_URL, feature_value.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user.token)

  def test_should_put_no_data(self):
    feature_value = FeatureValue.objects.all()[0]
    url = '{0}/{1}'.format(FEATURE_VALUE_LIST_URL, feature_value.pk)
    self.should_put_fail_when_no_data_sent(url, self.admin_user.token)

  def test_should_put_throws_invalid_length(self):
    feature_value = FeatureValue.objects.all()[0]
    data = {NAME_FIELD: get_intl_texts('a' * 31), FEATURE_TYPE_FIELD: 1}
    expected_content = {
      NAME_FIELD: get_intl_texts_errors('featureValue', 'maxLength'),
    }
    url = '{0}/{1}'.format(FEATURE_VALUE_LIST_URL, feature_value.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user.token)

  def test_should_put_throws_invalid_feature_type(self):
    feature_value = FeatureValue.objects.all()[0]
    data = {NAME_FIELD: get_intl_texts('Test Name'), FEATURE_TYPE_FIELD: 999}
    expected_content = {
      GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureType)],
    }
    url = '{0}/{1}'.format(FEATURE_VALUE_LIST_URL, feature_value.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user.token)

  def test_should_put_not_found(self):
    data = {NAME_FIELD: get_intl_texts('Test Name'), FEATURE_TYPE_FIELD: 1}
    expected_content = {
      GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureValue)],
    }
    url = '{0}/{1}'.format(FEATURE_VALUE_LIST_URL, 999)
    self.should_put_fail(url, data=data, expected_content=expected_content,
                         token=self.admin_user.token, expected_code=NOT_FOUND_CODE)
