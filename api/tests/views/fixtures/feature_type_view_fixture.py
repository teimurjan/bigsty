from api.models import Category, FeatureType, FeatureValue
from api.tests.views.fixtures.base.fixture import IFixture


class FeatureTypeViewFixture(IFixture):
  @staticmethod
  def make() -> None:
    category_1 = Category.objects.create()
    category_1.add_names({'en': 'Phone'})
    category_2 = Category.objects.create()
    category_2.add_names({'en': 'Laptop'})

    feature_type_1 = FeatureType.objects.create()
    feature_type_1.add_names({'en': 'Color'})
    feature_type_1.categories.add(category_1)
    feature_type_2 = FeatureType.objects.create()
    feature_type_2.add_names({'en': 'Processor'})
    feature_type_2.categories.add(category_1, category_2)

    feature_value_1 = FeatureValue.objects.create(feature_type=feature_type_1)
    feature_value_1.add_names({'en': 'Black'})
    feature_value_2 = FeatureValue.objects.create(feature_type=feature_type_1)
    feature_value_2.add_names({'en': 'White'})
