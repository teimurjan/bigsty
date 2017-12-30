from typing import Dict

from django.db import models

from api.models import Category, ProductType, Product
from api.models.base import SerializableModel, IntlModel
from api.models.language import IntlText


class FeatureType(SerializableModel, IntlModel):
  categories = models.ManyToManyField(Category, related_name='feature_types',
                                      related_query_name='feature_type', db_table='api_feature_type_x_category')

  def add_names(self, names: Dict[str, str]):
    self._add_intl_texts(names, FeatureTypeName)

  def update_names(self, names: Dict[str, str]):
    self._update_intl_texts(names, FeatureTypeName)

  class Meta:
    db_table = 'api_feature_type'


class FeatureValue(SerializableModel, IntlModel):
  feature_type = models.ForeignKey(FeatureType, related_name='feature_values',
                                   related_query_name='feature_value', on_delete=models.CASCADE)
  product_types = models.ManyToManyField(ProductType, related_name='feature_values', related_query_name='feature_value',
                                         db_table='api_feature_value_x_product_type')
  products = models.ManyToManyField(Product, related_name='feature_values', related_query_name='feature_value',
                                    db_table='api_feature_value_x_product')

  def add_names(self, names: dict):
    self._add_intl_texts(names, FeatureValueName)

  def update_names(self, names: Dict[str, str]):
    self._update_intl_texts(names, FeatureValueName)

  class Meta:
    db_table = 'api_feature_value'


class FeatureTypeName(IntlText):
  value = models.CharField(max_length=100, null=False, blank=False)
  owner = models.ForeignKey(FeatureType, related_name="names", related_query_name="name", on_delete=models.CASCADE)

  class Meta:
    db_table = 'api_feature_type_name'


class FeatureValueName(IntlText):
  value = models.CharField(max_length=100, null=False, blank=False)
  owner = models.ForeignKey(FeatureValue, related_name="names", related_query_name="name", on_delete=models.CASCADE)

  class Meta:
    db_table = 'api_feature_value_name'
