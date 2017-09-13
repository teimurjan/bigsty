from django.db import models

from api.models import Category, ProductType, Product
from api.models.base import BaseModel
from api.models.language import MultilingualText


class FeatureType(BaseModel):
  categories = models.ManyToManyField(Category, related_name='feature_types',
                                      related_query_name='feature_type', db_table='api_feature_type_x_category')

  class Meta:
    db_table = 'api_feature_type'


class FeatureValue(BaseModel):
  feature_type = models.ForeignKey(FeatureType, related_name='feature_type')
  product_types = models.ManyToManyField(ProductType, related_name='feature_values', related_query_name='feature_value',
                                         db_table='api_feature_value_x_product_type')
  products = models.ManyToManyField(Product, related_name='feature_values', related_query_name='feature_value',
                                    db_table='api_feature_value_x_product')

  class Meta:
    db_table = 'api_feature_value'


class FeatureTypeName(MultilingualText):
  value = models.CharField(max_length=100, null=False, blank=False)
  owner = models.ForeignKey(FeatureType, related_name="names")

  class Meta:
    db_table = 'api_feature_type_name'


class FeatureValueName(MultilingualText):
  value = models.CharField(max_length=100, null=False, blank=False)
  owner = models.ForeignKey(FeatureValue, related_name="names")

  class Meta:
    db_table = 'api_feature_value_name'
