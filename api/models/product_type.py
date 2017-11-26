from django.db import models

from api.models.base import SerializableModel, IntlModel
from api.models.category import Category
from api.models.language import IntlText


class ProductType(SerializableModel, IntlModel):
  image = models.FileField(upload_to="store/static/images/products/main/", null=True, blank=True)
  category = models.ForeignKey(Category, related_name="product_types",
                               related_query_name="product_types")

  @staticmethod
  def validate_relations(feature_values: list, category: Category):
    from api.models import FeatureValue
    possible_feature_values = FeatureValue.objects.filter(feature_type__categories__in=[category])
    are_feature_values_possible = all(fv in possible_feature_values for fv in feature_values)
    if not are_feature_values_possible: raise ProductType.FeatureValuesNotAcceptable
    if len(set(feature_values)) != len(feature_values): raise ProductType.SameFeatureValues

  def add_names(self, names: dict):
    self._add_intl_texts(names, ProductTypeName)
    return self

  def add_short_descriptions(self, short_descriptions: dict):
    self._add_intl_texts(short_descriptions, ProductTypeShortDescription)
    return self

  def add_descriptions(self, descriptions: dict):
    self._add_intl_texts(descriptions, ProductTypeDescription)
    return self

  def _get_field_value(self, field_name):
    if field_name == 'image':
      return self.image.url if self.image else None
    return super()._get_field_value(field_name)

  def __str__(self):
    return self.names.filter(language__pk='en')[0].value

  class Meta:
    db_table = 'api_product_type'

  class SameFeatureValues(Exception):
    pass

  class FeatureValuesNotAcceptable(Exception):
    pass


class ProductTypeName(IntlText):
  value = models.CharField(max_length=50, null=False, blank=False)
  owner = models.ForeignKey(ProductType, related_name="names", related_query_name='name')

  class Meta:
    db_table = 'api_product_type_name'


class ProductTypeDescription(IntlText):
  value = models.CharField(max_length=1000, null=False, blank=False)
  owner = models.ForeignKey(ProductType, related_name="descriptions", related_query_name='description')

  class Meta:
    db_table = 'api_product_type_description'


class ProductTypeShortDescription(IntlText):
  value = models.CharField(max_length=100, null=False, blank=False)
  owner = models.ForeignKey(ProductType, related_name="short_descriptions", related_query_name='short_description')

  class Meta:
    db_table = 'api_product_type_short_description'
