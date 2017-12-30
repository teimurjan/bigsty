from typing import Dict

from django.db import models

from api.models.base import SerializableModel, IntlModel
from api.models.language import IntlText


class Category(SerializableModel, IntlModel):
  def add_names(self, names: Dict[str, str]):
    self._add_intl_texts(names, CategoryName)
    return self

  def update_names(self, names: Dict[str, str]):
    self._update_intl_texts(names, CategoryName)
    return self

  def __str__(self):
    return self.names.filter(language__name='en')[0]


class CategoryName(IntlText):
  value = models.CharField(max_length=50, null=False, blank=False)
  owner = models.ForeignKey(Category, related_name="names", related_query_name="name", on_delete=models.CASCADE)

  def __str__(self):
    return 'Category: {0}, Language: {1}, Value: {2}'.format(self.owner.id, self.language, self.value)

  class Meta:
    db_table = 'api_category_name'
