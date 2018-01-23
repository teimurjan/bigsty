from typing import Dict, Type

from django.db import models
from django.db.models import Model


class Language(Model):
  name = models.CharField(max_length=2, blank=False, null=False, unique=True, primary_key=True)


class IntlText(Model):
  language = models.ForeignKey(Language, db_column="language", on_delete=models.CASCADE)

  class Meta:
    abstract = True


class IntlModel(Model):
  def _add_intl_texts(self, texts: Dict[str, str], text_model_cls: Type[IntlText]) -> None:
    for language_pk, name in texts.items():
      language = Language.objects.filter(pk=language_pk)
      if language.exists():
        text_model_cls.objects.create(owner=self, value=name, language=language[0])

  def _update_intl_texts(self, texts: Dict[str, str], text_model_cls: Type[IntlText]) -> None:
    for language_pk, name in texts.items():
      language = Language.objects.filter(pk=language_pk)
      if language.exists():
        text_model = text_model_cls.objects.get(owner=self, language=language[0])
        text_model.value = name
        text_model.save()

  class Meta:
    abstract = True
