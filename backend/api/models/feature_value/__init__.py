from django.db import models

from api.dto.feature_value import FeatureValueDTO
from api.models.feature_type import FeatureType
from api.models.product_type import ProductType
from api.models.product import Product
from api.models.intl import IntlText


class FeatureValue(models.Model):
    feature_type = models.ForeignKey(FeatureType, related_name='feature_values',
                                     related_query_name='feature_value', on_delete=models.CASCADE)
    product_types = models.ManyToManyField(ProductType, related_name='feature_values', related_query_name='feature_value',
                                           db_table='api_feature_value_x_product_type')
    products = models.ManyToManyField(Product, related_name='feature_values', related_query_name='feature_value',
                                      db_table='api_feature_value_x_product')

    def to_dto(self):
        names = [name.to_dto() for name in self.names]
        products = [product.to_dto() for product in self.products]
        product_types = [
            product_type.to_dto() for product_type in self.product_types
        ]
        return FeatureValueDTO(self.pk, names, product_types, self.feature_type.to_dto(), products)

    class Meta:
        db_table = 'api_feature_value'
