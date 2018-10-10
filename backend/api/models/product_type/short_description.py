from django.db import models

from api.dto.product_type.short_description import ProductTypeShortDescriptionDTO
from api.models.product_type import ProductType
from api.models.intl import IntlText


class ProductTypeShortDescription(IntlText):
    value = models.CharField(max_length=255, null=False, blank=False)
    owner = models.ForeignKey(ProductType, related_name="short_descriptions", related_query_name='short_description',
                              on_delete=models.CASCADE)

    def to_dto(self):
        return ProductTypeShortDescriptionDTO(self.pk, self.owner.to_dto(), self.value, self.language.to_dto())

    class Meta:
        db_table = 'api_product_type_short_description'
