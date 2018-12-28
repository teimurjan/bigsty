from django.db import models

from api.dto.category import CategoryDTO


class Category(models.Model):
    def to_dto(self, names_to_dto=True):
        names = [
            name.to_dto() if names_to_dto else name.pk for name in self.names.all()
        ]
        feature_types = [
            feature_type.to_dto() for feature_type in self.feature_types.all()
        ]
        return CategoryDTO(self.pk, names, feature_types)

    def __str__(self):
        return self.names.filter(language__name='en')[0]
