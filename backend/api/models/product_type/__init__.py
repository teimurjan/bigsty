from django.db import models

from api.dto.product_type import ProductTypeDTO
from api.models.category import Category
from api.models.intl import IntlText


class ProductType(models.Model):
    image = models.FileField(upload_to="product_types/", null=True, blank=True)
    category = models.ForeignKey(Category, related_name="product_types",
                                 related_query_name="product_types", on_delete=models.CASCADE)

    def to_dto(self):
        names = [name.to_dto() for name in self.names]
        descriptions = [
            description.to_dto() for description in self.descriptions
        ]
        short_descriptions = [
            short_description.to_dto() for short_description in self.short_descriptions
        ]
        feature_values = [
            feature_value.to_dto() for feature_value in self.feature_values
        ]
        products = [product.to_dto() for product in self.products]
        return ProductTypeDTO(
            self.pk, names, descriptions, short_descriptions, self.image,
            self.category.to_dto(), feature_values, products
        )

    class Meta:
        db_table = 'api_product_type'
