import abc

from django.core.exceptions import FieldError
from django.http import JsonResponse

from api.utils.errors.error_constants import INVALID_QUERY_ERR, GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields_constants import DATA_KEY
from api.utils.langauges_costants import ENGLISH
from api.utils.response_constants import BAD_REQUEST_CODE, NOT_FOUND_CODE, MESSAGE_OK


class DataJsonResponse(JsonResponse):
  def __init__(self, data):
    super().__init__({DATA_KEY: data})


class BaseSerializer:
  def __init__(self):
    self.data = None


class ModelSerializer(BaseSerializer):
  def __init__(self, Model, language=ENGLISH):
    super().__init__()
    self.Model = Model


class ListSerializer(ModelSerializer):
  @abc.abstractmethod
  def create(self):
    return

  def read(self, **kwargs):
    try:
      filtered_kwargs = {k: v for k, v in kwargs.items() if v is not None}
      return DataJsonResponse([model.to_dict() for model in self.Model.objects.filter(**filtered_kwargs)])
    except FieldError:
      return JsonResponse({GLOBAL_ERR_KEY: [INVALID_QUERY_ERR]}, status=BAD_REQUEST_CODE)


class DetailSerializer(ModelSerializer):
  def __init__(self, Model):
    super().__init__(Model)
    self.model_id = None

  def read(self):
    try:
      model = self.Model.objects.get(pk=self.model_id)
      return DataJsonResponse(model.to_dict())
    except self.Model.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(self.Model)]}, status=NOT_FOUND_CODE)

  @abc.abstractmethod
  def update(self):
    return

  def delete(self):
    try:
      self.Model.objects.get(pk=self.model_id).delete()
      return JsonResponse(MESSAGE_OK)
    except self.Model.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(self.Model)]}, status=NOT_FOUND_CODE)
