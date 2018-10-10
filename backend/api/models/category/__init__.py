from django.db import models

from api.dto.category import CategoryDTO


class Category(models.Model):

    def to_dto(self):
        names = [name.to_dto() for name in self.names]
        feature_types = [
            feature_type.to_dto() for feature_type in self.feature_types
        ]
        product_types = [
            product_type.to_dto() for product_type in self.product_types
        ]
        return CategoryDTO(self.pk, names, feature_types, product_types)

    def __str__(self):
        return self.names.filter(language__name='en')[0]
