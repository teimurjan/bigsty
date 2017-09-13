from django.db import models
from django.db.models.fields.files import FieldFile


class BaseModel(models.Model):
  def to_dict(self, exclude=list(), serialize=list()):
    return_dict = {}
    fields = self._meta.get_fields()
    for field in fields:
      field_name = self.__get_field_name(field)
      if field.is_relation and field_name not in exclude:
        return_dict[field_name] = self._get_related_field(field, field_name in serialize)
      elif field_name not in exclude:
        return_dict[field_name] = self._get_field(getattr(self, field_name))
    return return_dict

  def _get_related_field(self, field, should_serialize):
    if field.one_to_many or field.many_to_many:
      related_items = getattr(self, self.__get_field_name(field)).all()
      return [related_item.to_dict() for related_item in related_items] \
        if should_serialize else [field_item.pk for field_item in related_items]
    elif field.many_to_one:
      field_item = getattr(self, self.__get_field_name(field))
      return field_item.to_dict() if should_serialize else field_item.pk

  def __get_field_name(self, field):
    try:
      return field.related_name
    except AttributeError:
      return field.name

  def _get_field(self, field_value):
    if isinstance(field_value, FieldFile):
      return field_value.url if field_value else None
    return field_value

  class Meta:
    abstract = True


