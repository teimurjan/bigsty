from typing import Iterable, Type, List

from api.models import Category, FeatureType, FeatureValue, ProductType, Product
from api.tests.views.fixtures.base.fixture import IFixture


class ProductViewFixture(IFixture):
  @staticmethod
  def make() -> None:
    category_1 = Category.objects.create()
    category_1.add_names({'en': 'Phone'})

    feature_type_1, feature_type_2 = ProductViewFixture._create_feature_types(category_1)

    feature_value_1, feature_value_2, feature_value_3 = ProductViewFixture._create_feature_values_1(feature_type_1)
    feature_value_4, feature_value_5, feature_value_6 = ProductViewFixture._create_feature_values_2(feature_type_2)

    product_type_1 = ProductType.objects.create(category=category_1)
    product_type_1.add_names({'en': 'Iphone 7'})
    product_type_1.add_short_descriptions({'en': 'Iphone 7 Short Description'})
    product_type_1.add_descriptions({'en': 'Iphone 7 Description'})
    product_type_1.feature_values.add(feature_value_1, feature_value_2, feature_value_3,
                                      feature_value_4, feature_value_5)

    ProductViewFixture._create_product(product_type_1, [feature_value_1, feature_value_4])
    ProductViewFixture._create_product(product_type_1, [feature_value_1, feature_value_5])
    ProductViewFixture._create_product(product_type_1, [feature_value_2, feature_value_4])
    ProductViewFixture._create_product(product_type_1, [feature_value_2, feature_value_5])

  @staticmethod
  def _create_feature_types(category: Type[Category]) -> Iterable[Type[FeatureType]]:
    feature_type_1 = FeatureType.objects.create()
    feature_type_1.add_names({'en': 'Color'})
    feature_type_1.categories.add(category)
    feature_type_2 = FeatureType.objects.create()
    feature_type_2.add_names({'en': 'Memory'})
    feature_type_2.categories.add(category)
    return feature_type_1, feature_type_2

  @staticmethod
  def _create_feature_values_1(feature_type: Type[FeatureType]) -> Iterable[Type[FeatureValue]]:
    feature_value_1 = FeatureValue.objects.create(feature_type=feature_type)
    feature_value_1.add_names({'en': 'Black'})
    feature_value_2 = FeatureValue.objects.create(feature_type=feature_type)
    feature_value_2.add_names({'en': 'White'})
    feature_value_3 = FeatureValue.objects.create(feature_type=feature_type)
    feature_value_3.add_names({'en': 'Gold'})
    return feature_value_1, feature_value_2, feature_value_3

  @staticmethod
  def _create_feature_values_2(feature_type: Type[FeatureType]) -> Iterable[Type[FeatureValue]]:
    feature_value_4 = FeatureValue.objects.create(feature_type=feature_type)
    feature_value_4.add_names({'en': '64GB'})
    feature_value_5 = FeatureValue.objects.create(feature_type=feature_type)
    feature_value_5.add_names({'en': '128GB'})
    feature_value_6 = FeatureValue.objects.create(feature_type=feature_type)
    feature_value_6.add_names({'en': '512GB'})
    return feature_value_4, feature_value_5, feature_value_6

  @staticmethod
  def _create_product(product_type: Type[ProductType], feature_values: List[Type[FeatureValue]]) -> Type[Product]:
    product = Product.objects.create(product_type=product_type, price=250)
    product.feature_values.add(*feature_values)
    return product
