from django.db import models

from api.models.base import BaseModel
from api.models.language import MultilingualText


class Category(BaseModel):
  def _get_field(self, field_value):
    if isinstance(field_value, CategoryName):
      return self.names.filter(language__name='en')[0]
    return super()._get_field(field_value)

  def __str__(self): return self.names.filter(language__name='en')[0]


class CategoryName(MultilingualText):
  value = models.CharField(max_length=50, null=False, blank=False)
  owner = models.ForeignKey(Category, related_name="names")

  class Meta:
    db_table = 'api_category_name'
