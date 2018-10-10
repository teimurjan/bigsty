from django.db import models

from api.dto.category import CategoryDTO


class Category(models.Model):

    def to_dto(self):
        names = [name.to_dto() for name in self.names.all()]
        return CategoryDTO(self.pk, names)

    def __str__(self):
        return self.names.filter(language__name='en')[0]
