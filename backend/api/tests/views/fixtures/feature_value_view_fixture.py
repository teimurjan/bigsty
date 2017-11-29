from api.models import Category, FeatureType, FeatureValue
from api.tests.views.fixtures.base.fixture import IFixture


class FeatureValueViewFixture(IFixture):
  @staticmethod
  def make() -> None:
    category_1 = Category.objects.create()
    category_1.add_names({'en': 'Phone'})

    feature_type_1 = FeatureType.objects.create()
    feature_type_1.add_names({'en': 'Color'})
    feature_type_1.categories.add(category_1)
    feature_type_2 = FeatureType.objects.create()
    feature_type_2.add_names({'en': 'Display Size'})
    feature_type_2.categories.add(category_1)

    feature_value_1 = FeatureValue.objects.create(feature_type=feature_type_1)
    feature_value_1.add_names({'en': 'Black'})
    feature_value_2 = FeatureValue.objects.create(feature_type=feature_type_1)
    feature_value_2.add_names({'en': 'White'})

    feature_value_3 = FeatureValue.objects.create(feature_type=feature_type_2)
    feature_value_3.add_names({'en': '5.5 inches'})
    feature_value_4 = FeatureValue.objects.create(feature_type=feature_type_2)
    feature_value_4.add_names({'en': '4.7 inches'})
