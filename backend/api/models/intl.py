
from django.db import models

from api.dto.intl import LanguageDTO


class Language(models.Model):
    name = models.CharField(max_length=10, blank=False, null=False, unique=True)

    def to_dto(self):
        return LanguageDTO(self.pk, self.name)


class IntlText(models.Model):
    language = models.ForeignKey(
        Language, db_column="language", on_delete=models.CASCADE
    )

    class Meta:
        abstract = True
