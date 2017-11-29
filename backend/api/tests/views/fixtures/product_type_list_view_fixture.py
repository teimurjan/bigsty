from typing import Iterable, Type, List

from api.models import FeatureType, FeatureValue, ProductType, Product, Category
from api.tests.views.fixtures.base.fixture import IFixture


class ProductTypeListViewFixture(IFixture):
  @staticmethod
  def make() -> None:
    category_1 = Category.objects.create()
    category_1.add_names({'en': 'Phone'})

    category_2 = Category.objects.create()
    category_2.add_names({'en': 'Laptop'})

    feature_type_1, feature_type_2 = ProductTypeListViewFixture._create_feature_types_1(category_1)

    feature_value_1, feature_value_2, feature_value_3 = ProductTypeListViewFixture._create_feature_values_1(
      feature_type_1)
    feature_value_4, feature_value_5, feature_value_6 = ProductTypeListViewFixture._create_feature_values_2(
      feature_type_2)
    feature_value_7, feature_value_8 = ProductTypeListViewFixture._create_feature_values_3(feature_type_1)

    product_type_1 = ProductType.objects.create(category=category_1)
    product_type_1.add_names({'en': 'Iphone 7'})
    product_type_1.add_short_descriptions({'en': 'Iphone 7 Short Description'})
    product_type_1.add_descriptions({'en': 'Iphone 7 Description'})
    product_type_1.feature_values.add(feature_value_1, feature_value_2, feature_value_3,
                                      feature_value_4, feature_value_5)

    product_type_2 = ProductType.objects.create(category=category_1)
    product_type_2.add_names({'en': 'Iphone X'})
    product_type_2.add_short_descriptions({'en': 'Iphone X Short Description'})
    product_type_2.add_descriptions({'en': 'Iphone X Description'})
    product_type_2.feature_values.add(feature_value_7, feature_value_8, feature_value_4, feature_value_6)

    ProductTypeListViewFixture._create_product(product_type_1, [feature_value_1, feature_value_4])
    ProductTypeListViewFixture._create_product(product_type_1, [feature_value_1, feature_value_5])
    ProductTypeListViewFixture._create_product(product_type_1, [feature_value_2, feature_value_4])
    ProductTypeListViewFixture._create_product(product_type_1, [feature_value_2, feature_value_5])
    ProductTypeListViewFixture._create_product(product_type_2, [feature_value_7, feature_value_4])
    ProductTypeListViewFixture._create_product(product_type_2, [feature_value_8, feature_value_6])

  @staticmethod
  def _create_feature_types_1(category: Category) -> Iterable[Type[FeatureType]]:
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
    feature_value_6.add_names({'en': '256GB'})
    return feature_value_4, feature_value_5, feature_value_6

  @staticmethod
  def _create_feature_values_3(feature_type: Type[FeatureType]) -> Iterable[Type[FeatureValue]]:
    feature_value_7 = FeatureValue.objects.create(feature_type=feature_type)
    feature_value_7.add_names({'en': 'Gray'})
    feature_value_8 = FeatureValue.objects.create(feature_type=feature_type)
    feature_value_8.add_names({'en': 'White'})
    return feature_value_7, feature_value_8

  @staticmethod
  def _create_product(product_type: ProductType, feature_values: List[Type[FeatureValue]]) -> Type[Product]:
    product = Product.objects.create(product_type=product_type, price=250)
    product.feature_values.add(*feature_values)
    return product
