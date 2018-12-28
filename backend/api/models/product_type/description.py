from django.db import models

from api.dto.product_type.description import ProductTypeDescriptionDTO
from api.models.product_type import ProductType
from api.models.intl import IntlText


class ProductTypeDescription(IntlText):
    value = models.CharField(max_length=10000, null=False, blank=False)
    product_type = models.ForeignKey(ProductType, related_name="descriptions", related_query_name='description',
                                     on_delete=models.CASCADE)

    def to_dto(self):
        return ProductTypeDescriptionDTO(
            self.pk,
            self.product_type.to_dto(intl_texts_to_dto=False),
            self.value,
            self.language.to_dto()
        )

    class Meta:
        db_table = 'api_product_type_description'
