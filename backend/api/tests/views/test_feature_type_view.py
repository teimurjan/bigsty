from typing import Dict

from django.urls import reverse

from api.models import FeatureType
from api.tests.views.base.base_detail_view_test import DetailViewTestCase
from api.tests.views.fixtures.feature_type_view_fixture import FeatureTypeViewFixture
from api.tests.views.utils import get_intl_texts, get_intl_texts_errors
from api.utils.errors.error_constants import GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.http_constants import NOT_FOUND_CODE

list_url = reverse('feature_types')


def get_data(names: Dict[str, str] = get_intl_texts()):
  return {'name': names}


class FeatureTypeViewTest(DetailViewTestCase):
  _fixtures = DetailViewTestCase._fixtures + [FeatureTypeViewFixture]

  def test_should_get_succeed(self) -> None:
    feature_type = FeatureType.objects.all()[0]
    self.should_get_by_id_succeed(list_url, FeatureType, feature_type.pk)

  def test_should_get_succeed_with_serialize(self) -> None:
    feature_type = FeatureType.objects.all()[0]
    expected = feature_type.serialize(serialize=['categories'])
    url = '{0}/{1}?serialize=["categories"]'.format(list_url, feature_type.pk)
    self.should_get_succeed(url, expected)

  def test_should_get_succeed_with_exclude(self) -> None:
    feature_type = FeatureType.objects.all()[0]
    expected = feature_type.serialize(exclude=['categories'])
    url = '{0}/{1}?exclude=["categories"]'.format(list_url, feature_type.pk)
    self.should_get_succeed(url, expected)

  def test_should_get_not_found(self) -> None:
    self.should_get_by_id_fail(list_url, FeatureType, 999)

  def test_should_put_succeed(self):
    feature_type = FeatureType.objects.all()[0]
    en_name = 'New name for Color'
    data = get_data(get_intl_texts(en_name))
    url = '{0}/{1}'.format(list_url, feature_type.pk)
    expected = feature_type.serialize()
    expected['name'] = en_name
    self.should_put_succeed(url, data, self.manager_user_token, expected)

  def test_should_put_succeed_with_serialize_and_exclude(self):
    feature_type = FeatureType.objects.all()[0]
    en_name = 'New name for Color'
    data = get_data(get_intl_texts(en_name))
    url = '{0}/{1}?serialize=["categories"]&exclude=["name"]'.format(list_url, feature_type.pk)
    expected = feature_type.serialize(serialize=["categories"])
    del expected['name']
    self.should_put_succeed(url, data, self.manager_user_token, expected)

  def test_should_put_require_role(self):
    feature_type = FeatureType.objects.all()[0]
    url = '{0}/{1}'.format(list_url, feature_type.pk)
    self.should_put_require_role(url, self.reader_user_token)

  def test_should_post_no_data(self) -> None:
    feature_type = FeatureType.objects.all()[0]
    url = '{0}/{1}'.format(list_url, feature_type.pk)
    self.should_put_fail_when_no_data_sent(url, self.admin_user_token)

  def test_should_put_null_values(self):
    feature_type = FeatureType.objects.all()[0]
    data = get_data()
    url = '{0}/{1}'.format(list_url, feature_type.pk)
    self.should_put_fail(url, data, token=self.manager_user_token, expected_content={
      'name': get_intl_texts_errors('featureType', field='name'),
    })

  def test_should_put_empty_values(self):
    feature_type = FeatureType.objects.all()[0]
    data = get_data(get_intl_texts(''))
    url = '{0}/{1}'.format(list_url, feature_type.pk)
    self.should_put_fail(url, data, token=self.manager_user_token, expected_content={
      'name': get_intl_texts_errors('featureType', error='mustNotBeEmpty', field='name'),
    })

  def test_should_put_invalid_length(self):
    feature_type = FeatureType.objects.all()[0]
    data = get_data(get_intl_texts('a' * 31))
    url = '{0}/{1}'.format(list_url, feature_type.pk)
    self.should_put_fail(url, data, token=self.manager_user_token, expected_content={
      'name': get_intl_texts_errors('featureType', error='maxLength', field='name'),
    })

  def test_should_put_invalid_feature_type(self):
    data = get_data(get_intl_texts('New name'))
    url = '{0}/{1}'.format(list_url, 999)
    self.should_put_fail(url, data, token=self.manager_user_token, expected_content={
      GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureType)]
    }, expected_code=NOT_FOUND_CODE)

  def test_should_delete_succeed(self):
    feature_type = FeatureType.objects.all()[0]
    self.should_delete_succeed(list_url, feature_type.pk, self.manager_user_token)

  def test_should_delete_require_role(self):
    feature_type = FeatureType.objects.all()[0]
    self.should_delete_require_role(list_url, feature_type.pk, self.reader_user_token)

  def test_should_delete_not_found(self):
    self.should_delete_not_found(list_url, FeatureType, 999, self.manager_user_token)
