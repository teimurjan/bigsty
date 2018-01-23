from typing import Dict, List, Any

from django.db.models import Model

from api.models.intl import IntlModel, IntlText
from api.utils.langauges import DEFAULT_LANGUAGE
from api.serializers.model_field import IntlFieldSerializer, FieldSerializer


class SerializableModel(Model):
  hidden_fields = []

  def serialize(self,
                exclude: List[str] = list(),
                serialize: List[str] = list(),
                **kwargs
                ) -> Dict[str, Any]:
    serialized = {}
    fields = self._meta.get_fields()
    for field in fields:
      field_name = self._get_field_name(field)
      if field_name not in exclude and field_name not in self.hidden_fields:
        field_serializer = FieldSerializer(field, self._get_field_value(field_name), field_name in serialize)
        serialized[field_name] = field_serializer.serialize()
    return serialized

  def _get_field_name(self, field):
    should_show_related_name = field.one_to_many or (field.many_to_many and not hasattr(field, 'attname'))
    if should_show_related_name:
      return field.related_name
    else:
      return field.name

  def _get_field_value(self, field_name):
    return getattr(self, field_name)

  class Meta:
    abstract = True


class IntlSerializableModel(SerializableModel, IntlModel):
  def serialize(self, language: str = DEFAULT_LANGUAGE,
                exclude: List[str] = list(),
                serialize: List[str] = list()
                ) -> Dict[str, Any]:
    serialized = {}
    fields = self._meta.get_fields()
    for field in fields:
      field_name = self._get_field_name(field)
      if field_name not in exclude and field_name not in self.hidden_fields:
        field_serializer = IntlFieldSerializer(field, self._get_field_value(field_name),
                                               language, field_name in serialize)
        serialized_field = field_serializer.serialize()
        if field.related_model and issubclass(field.related_model, IntlText):
          serialized[field.related_query_name] = serialized_field
        else:
          serialized[field_name] = serialized_field
    return serialized

  class Meta:
    abstract = True
