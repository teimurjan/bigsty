from api.models import Category, FeatureType
from api.tests.views.fixtures.base.fixture import IFixture


class FeatureTypeListViewFixture(IFixture):
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
    feature_type_3 = FeatureType.objects.create()
    feature_type_3.add_names({'en': 'Cooler'})
    feature_type_3.categories.add(category_2)
