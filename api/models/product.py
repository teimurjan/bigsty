from django.db import models
from api.models.base import SerializableModel
from api.models.product_type import ProductType


class Product(SerializableModel):
  discount = models.IntegerField(default=0)
  price = models.IntegerField(null=False, blank=False)
  quantity = models.IntegerField(null=False, blank=False, default=0)
  product_type = models.ForeignKey(ProductType, null=True, related_name='products', related_query_name='product')

  @staticmethod
  def validate_relations(feature_values: list, product_type: ProductType()):
    from api.models import FeatureValue
    possible_feature_values = FeatureValue.objects.filter(product_types__in=[product_type])
    are_feature_values_possible = all(fv in possible_feature_values for fv in feature_values)
    if not are_feature_values_possible: raise Product.FeatureValuesNotAcceptable
    feature_types = [fv.feature_type_id for fv in feature_values]
    feature_types_has_duplicates = len(feature_types) != len(set(feature_types))
    if feature_types_has_duplicates: raise Product.FeatureValuesOfTheSameType

  def is_available(self):
    return int(self.quantity) > 0

  class FeatureValuesOfTheSameType(Exception):
    pass

  class FeatureValuesNotAcceptable(Exception):
    pass


class ProductImage(SerializableModel):
  file = models.FileField(upload_to="store/static/images/products/")
  product = models.ForeignKey(Product, related_name="images", related_query_name='image', on_delete=models.CASCADE)

  def _get_field_value(self, field_name):
    if field_name == 'file':
      return self.file.url
    return super()._get_field_value(field_name)

  class Meta:
    db_table = 'api_product_image'

  def __str__(self):
    return self.file.name
