from django.db import models
from django.db.models import Model


class Language(Model):
  name = models.CharField(max_length=2, blank=False, null=False, unique=True, primary_key=True)


class IntlText(Model):
  language = models.ForeignKey(Language, db_column="language")


  class Meta:
    abstract = True
