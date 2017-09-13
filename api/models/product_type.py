from django.db import models

from api.models.base import BaseModel
from api.models.category import Category
from api.models.language import MultilingualText


class ProductType(BaseModel):
  image = models.FileField(upload_to="store/static/images/products/main/", null=True, blank=True)
  category = models.ForeignKey(Category, related_name="product_types",
                               related_query_name="product_type")

  def __str__(self): return self.names.filter(language__name='en')[0]

  class Meta:
    db_table = 'api_product_type'


class ProductTypeName(MultilingualText):
  value = models.CharField(max_length=50, null=False, blank=False)
  owner = models.ForeignKey(ProductType, related_name="names")

  class Meta:
    db_table = 'api_product_type_name'


class ProductTypeDescription(MultilingualText):
  value = models.CharField(max_length=1000, null=False, blank=False)
  owner = models.ForeignKey(ProductType, related_name="descriptions")

  class Meta:
    db_table = 'api_product_type_description'


class ProductTypeShortDescription(MultilingualText):
  value = models.CharField(max_length=100, null=False, blank=False)
  owner = models.ForeignKey(ProductType, related_name="short_descriptions")

  class Meta:
    db_table = 'api_product_type_short_description'
