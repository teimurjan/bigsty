from django.db import models

from api.dto.product import ProductDTO
from api.models.product_type import ProductType


class Product(models.Model):
    discount = models.IntegerField(default=0)
    price = models.IntegerField(null=False, blank=False)
    quantity = models.IntegerField(null=False, blank=False, default=0)
    product_type = models.ForeignKey(ProductType, null=True, related_name='products',
                                     related_query_name='product', on_delete=models.CASCADE)

    def to_dto(self):
        images = [image.to_dto() for image in self.images]
        feature_values = [
            feature_value.to_dto() for feature_value in self.feature_values
        ]
        return ProductDTO(self.pk, self.discount, self.price, self.quantity,
                          self.product_type.to_dto(), images, feature_values)

    class FeatureValuesOfTheSameType(Exception):
        pass

    class FeatureValuesNotAcceptable(Exception):
        pass

    class Meta:
        db_table = 'api_product'
