from typing import List

from api.models import IntlText


class FieldSerializer:
  def __init__(self, field, model_field_value, should_serialize=False):
    self.field = field
    self.should_serialize = should_serialize
    self.model_field_value = model_field_value

  def serialize(self):
    if self.field.is_relation:
      if self.field.one_to_many or self.field.many_to_many:
        return self._serialize_m2m_field()
      elif self.field.many_to_one:
        return self._serialize_many_to_one_field()
    else:
      return self.model_field_value

  def _serialize_m2m_field(self) -> List:
    related_items = self.model_field_value.order_by('id')
    if self.should_serialize:
      return [related_item.serialize() for related_item in related_items if
              hasattr(related_item, 'serialize')]
    else:
      return [related_item.pk for related_item in related_items]

  def _serialize_many_to_one_field(self):
    if self.should_serialize and hasattr(self.model_field_value, 'serialize'):
      return self.model_field_value.serialize()
    else:
      return self.model_field_value.pk


class IntlFieldSerializer(FieldSerializer):
  def __init__(self, field, model_field_value, language, should_serialize=False):
    super().__init__(field, model_field_value, should_serialize)
    self.field = field
    self.should_serialize = should_serialize
    self.model_field_value = model_field_value
    self.language = language

  def _serialize_m2m_field(self) -> List:
    if issubclass(self.field.related_model, IntlText):
      return self.model_field_value.get(language__name=self.language).value
    else:
      return super()._serialize_m2m_field()
