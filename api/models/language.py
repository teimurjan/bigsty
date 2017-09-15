from django.db import models

from api.models.base import BaseModel


class Language(BaseModel):
  name = models.CharField(max_length=2, blank=False, null=False, unique=True, primary_key=True)


class MultilingualText(BaseModel):
  language = models.ForeignKey(Language, db_column="language")
  #
  # @property
  # def value(self): raise NotImplementedError
  #
  # @property
  # def owner(self): raise NotImplementedError

  class Meta:
    abstract = True
