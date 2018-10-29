from django.db import models

from api.dto.product_type.name import ProductTypeNameDTO
from api.models.product_type import ProductType
from api.models.intl import IntlText


class ProductTypeName(IntlText):
    value = models.CharField(max_length=50, null=False, blank=False)
    product_type = models.ForeignKey(ProductType, related_name="names", related_query_name='name',
                                     on_delete=models.CASCADE)

    def to_dto(self):
        return ProductTypeNameDTO(self.pk, self.product_type.pk, self.value, self.language.to_dto())

    class Meta:
        db_table = 'api_product_type_name'
