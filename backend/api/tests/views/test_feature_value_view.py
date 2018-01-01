from django.urls import reverse

from api.models import FeatureValue, FeatureType
from api.tests.views.base.base_detail_view_test import DetailViewTestCase
from api.tests.views.fixtures.feature_value_view_fixture import FeatureValueViewFixture
from api.tests.views.utils import get_intl_texts, get_intl_texts_errors
from api.utils.errors.error_constants import GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.http_constants import NOT_FOUND_CODE

list_url = reverse('feature_values')


class FeatureValueViewTest(DetailViewTestCase):
  _fixtures = DetailViewTestCase._fixtures + [FeatureValueViewFixture]

  def setUp(self):
    self.color_ft = FeatureType.objects.filter(name__value='Color')[0]

  def test_should_get_succeed(self):
    feature_value = FeatureValue.objects.all()[0]
    self.should_get_by_id_succeed(list_url, FeatureValue, feature_value.pk)

  def test_should_get_succeed_with_serialize(self) -> None:
    feature_value = FeatureValue.objects.all()[0]
    expected = feature_value.serialize(serialize=['feature_type'])
    url = '{0}/{1}?serialize=["feature_type"]'.format(list_url, feature_value.pk)
    self.should_get_succeed(url, expected)

  def test_should_get_succeed_with_exclude(self) -> None:
    feature_value = FeatureValue.objects.all()[0]
    expected = feature_value.serialize(exclude=['feature_type'])
    url = '{0}/{1}?exclude=["feature_type"]'.format(list_url, feature_value.pk)
    self.should_get_succeed(url, expected)

  def test_should_get_not_found(self) -> None:
    self.should_get_by_id_fail(list_url, FeatureValue, 999)

  def test_should_put_succeed(self):
    feature_value = FeatureValue.objects.all()[0]
    name = '4 inches'
    data = {'name': get_intl_texts(name), 'feature_type': self.color_ft.id}
    expected = data.copy()
    expected['name'] = name
    url = '{0}/{1}'.format(list_url, feature_value.pk)
    self.should_put_succeed(url, data, self.admin_user_token, expected)

  def test_should_put_require_role(self):
    feature_value = FeatureValue.objects.all()[0]
    url = '{0}/{1}'.format(list_url, feature_value.pk)
    self.should_put_require_role(url, self.reader_user_token)

  def test_should_put_null_values(self):
    feature_value = FeatureValue.objects.all()[0]
    data = {'name': get_intl_texts(), 'feature_type': None}
    expected_content = {
      'name': get_intl_texts_errors('featureValue'),
      'feature_type': ['errors.featureValue.feature_type.mustNotBeNull']
    }
    url = '{0}/{1}'.format(list_url, feature_value.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_empty_values(self):
    feature_value = FeatureValue.objects.all()[0]
    data = {'name': get_intl_texts(''), 'feature_type': ''}
    expected_content = {
      'name': get_intl_texts_errors('featureValue', 'mustNotBeEmpty'),
      'feature_type': ['errors.featureValue.feature_type.mustBeInteger'],
    }
    url = '{0}/{1}'.format(list_url, feature_value.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_no_data(self):
    feature_value = FeatureValue.objects.all()[0]
    url = '{0}/{1}'.format(list_url, feature_value.pk)
    self.should_put_fail_when_no_data_sent(url, self.admin_user_token)

  def test_should_put_throws_invalid_length(self):
    feature_value = FeatureValue.objects.all()[0]
    data = {'name': get_intl_texts('a' * 31), 'feature_type': self.color_ft.id}
    expected_content = {
      'name': get_intl_texts_errors('featureValue', 'maxLength'),
    }
    url = '{0}/{1}'.format(list_url, feature_value.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_throws_invalid_feature_type(self):
    feature_value = FeatureValue.objects.all()[0]
    data = {'name': get_intl_texts('Test Name'), 'feature_type': 999}
    expected_content = {
      GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureType)],
    }
    url = '{0}/{1}'.format(list_url, feature_value.pk)
    self.should_put_fail(url, data=data, expected_content=expected_content, token=self.admin_user_token)

  def test_should_put_not_found(self):
    data = {'name': get_intl_texts('Test Name'), 'feature_type': self.color_ft.id}
    expected_content = {
      GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureValue)],
    }
    url = '{0}/{1}'.format(list_url, 999)
    self.should_put_fail(url, data=data, expected_content=expected_content,
                         token=self.admin_user_token, expected_code=NOT_FOUND_CODE)

  def test_should_delete_succeed(self):
    feature_value = FeatureValue.objects.all()[0]
    self.should_delete_succeed(list_url, feature_value.pk, self.manager_user_token)

  def test_should_delete_require_role(self):
    feature_value = FeatureValue.objects.all()[0]
    self.should_delete_require_role(list_url, feature_value.pk, self.reader_user_token)

  def test_should_delete_not_found(self):
    self.should_delete_not_found(list_url, FeatureValue, 999, self.manager_user_token)
