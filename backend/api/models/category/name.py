from django.db import models

from api.dto.category.name import CategoryNameDTO
from api.models.category import Category
from api.models.intl import IntlText


class CategoryName(IntlText):
    value = models.CharField(max_length=50, null=False, blank=False)
    category = models.ForeignKey(Category, related_name="names",
                              related_query_name="name", on_delete=models.CASCADE)

    def to_dto(self):
        return CategoryNameDTO(self.pk, self.category.to_dto(), self.value, self.language.to_dto())

    def __str__(self):
        return self.value

    class Meta:
        db_table = 'api_category_name'
