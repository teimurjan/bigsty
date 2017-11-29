from api.models import Category, FeatureType
from api.tests.views.fixtures.base.fixture import IFixture


class CategoryListViewFixture(IFixture):
  @staticmethod
  def make() -> None:
    category_1 = Category.objects.create()
    category_1.add_names({'en': 'Phone'})
    category_2 = Category.objects.create()
    category_2.add_names({'en': 'Laptop'})

    feature_type_1 = FeatureType.objects.create(pk=1)
    feature_type_1.add_names({'en': 'RAM'})
    feature_type_1.categories.add(category_1, category_2)
    feature_type_2 = FeatureType.objects.create(pk=2)
    feature_type_2.add_names({'en': 'Sim cards number'})
    feature_type_2.categories.add(category_1)
