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

    def to_dto(self, names_to_dto=True):
        names = [
            name.to_dto() if names_to_dto else name.pk for name in self.names.all()
        ]
        feature_type = self.feature_type.to_dto()
        return FeatureValueDTO(self.pk, names, feature_type)

    class Meta:
        db_table = 'api_feature_value'
