from datetime import datetime
from typing import Type, Dict, List, Any

from django.db.models import Model, Field

from api.models import IntlText, Language
from api.utils.langauges import DEFAULT_LANGUAGE


class SerializableModel(Model):
  def serialize(self,
                language: str = DEFAULT_LANGUAGE,
                exclude: List[str] = list(),
                serialize: List[str] = list()
                ) -> Dict[str, Any]:
    self.language, self.serialize_ = language, serialize

    serialized = {}
    fields = self._meta.get_fields()
    for field in fields:
      field_name = self.__get_field_name(field)
      if field_name in exclude or self._should_hide(field_name): continue

      if field.is_relation:
        if field.one_to_many or field.many_to_many:
          intl_field_query_name = field.related_query_name
          if self.__is_intl_field(field) and intl_field_query_name not in exclude:
            serialized[intl_field_query_name] = self.__get_translation(field_name)
          else:
            serialized[field_name] = self.__get_many_items(field_name)
        elif field.many_to_one:
          serialized[field_name] = self.__get_one_item(field_name)
      else:
        serialized[field_name] = self._get_field_value(field_name)
    return serialized

  def __get_many_items(self, field_name: str) -> List:
    related_items = getattr(self, field_name).all()
    if field_name in self.serialize_:
      return [related_item.serialize(self.language) for related_item in related_items]
    return [related_item.pk for related_item in related_items]

  def __get_one_item(self, field_name: str):
    related_item = getattr(self, field_name)
    return related_item.serialize(self.language) if field_name in self.serialize_ else related_item.pk

  def __get_field_name(self, field: Type[Field]) -> str:
    try:
      return field.related_name
    except AttributeError:
      return field.name

  def _get_field_value(self, field_name: str):
    field_value = getattr(self, field_name)
    if type(field_value) is datetime:
      return str(field_value)
    return field_value

  def __is_intl_field(self, field: Type[Field]) -> bool:
    return issubclass(field.related_model, IntlText)

  def __get_translation(self, field_name: str) -> str:
    return getattr(self, field_name).get(language__name=self.language).value

  def _should_hide(self, field_name: str) -> bool:
    return False

  class Meta:
    abstract = True


class IntlModel(Model):
  def _add_intl_texts(self, texts: Dict[str, str], text_model_cls: Type[IntlText]) -> None:
    for language_pk, name in texts.items():
      language = Language.objects.filter(pk=language_pk)
      if not language.exists(): continue
      text_model_cls.objects.create(owner=self, value=name, language=language[0])

  def _update_intl_texts(self, texts: Dict[str, str], text_model_cls: Type[IntlText]) -> None:
    for language_pk, name in texts.items():
      language = Language.objects.filter(pk=language_pk)
      if not language.exists(): continue
      text_model = text_model_cls.objects.get(owner=self, language=language[0])
      text_model.value = name
      text_model.save()

  @staticmethod
  def _get_by_intl_value(value: str, language: Type[Language],
                         text_model_cls: Type[IntlText]):
    return text_model_cls.objects.filter(value=value, language=language)

  class Meta:
    abstract = True
