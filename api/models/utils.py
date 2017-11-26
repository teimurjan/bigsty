from api.models import IntlText
from django.db import models


class ModelToDictTransformer(object):
  def __init__(self, language: str, exclude: list = None, serialize: list = None):
    self.serialize = serialize or []
    self.exclude = exclude or []
    self.language = language

  def handle(self, model: models.Model):
    dict_ = {}
    self.model_ = model
    fields = self.model_._meta.get_fields()
    for field in fields:
      field_name = self.__get_field_name(field)
      if field_name in self.exclude: continue

      if field.is_relation:
        if field.one_to_many or field.many_to_many:
          if self.__is_multilingual_field(field):
            dict_[field.related_query_name] = self.__get_translation(field_name)
          else:
            dict_[field_name] = self.__get_many_items(field_name)
        elif field.many_to_one:
          dict_[field_name] = self.__get_one_item(field_name)
      else:
        dict_[field_name] = self.__get_field_value(field_name)

    return dict_

  def __get_many_items(self, field_name):
    related_items = getattr(self.model_, field_name).all()
    if field_name in self.serialize:
      return [self.handle(related_item) for related_item in related_items]
    return [related_item.pk for related_item in related_items]

  def __get_one_item(self, field_name):
    related_item = getattr(self.model_, field_name)
    return related_item.dictify() if field_name in self.serialize else related_item.pk

  def __get_field_name(self, field):
    try:
      return field.related_name
    except AttributeError:
      return field.name

  def __get_field_value(self, field_name):
    from datetime import datetime
    from django.db.models.fields.files import FieldFile
    field_value = getattr(self.model_, field_name)
    if isinstance(field_value, FieldFile):
      return field_value.url if field_value else None
    if isinstance(field_value, datetime):
      return field_value.__str__()
    return field_value

  def __is_multilingual_field(self, field):
    return issubclass(field.related_model, IntlText)

  def __get_translation(self, field_name):
    return getattr(self.model_, field_name).get(language__name=self.language).value
