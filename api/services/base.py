import abc
from typing import Type

from django.core.exceptions import FieldError
from django.http import JsonResponse

from api.models.base import SerializableModel
from api.services.utils import deep_serialize_query
from api.utils.json_responses import DataJsonResponse
from api.utils.errors.error_constants import INVALID_QUERY_ERR, GLOBAL_ERR_KEY
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.http_constants import BAD_REQUEST_CODE, NOT_FOUND_CODE


class Service:
  def __init__(self, request=None):
    self.request = request


class ModelService(Service):
  def __init__(self, model_cls: Type[SerializableModel], request):
    super().__init__(request)
    self.model_cls = model_cls
    self.request = request


class ListService(ModelService):
  @abc.abstractmethod
  def create(self) -> JsonResponse:
    raise NotImplementedError()

  def read(self, **kwargs) -> JsonResponse:
    try:
      q = deep_serialize_query(kwargs.items(), exclude=['serialize', 'exclude'])
      return DataJsonResponse(
        [model.serialize(**self.request.serializer_data) for model in self.model_cls.objects.filter(**q)])
    except FieldError as e:
      return JsonResponse({GLOBAL_ERR_KEY: [INVALID_QUERY_ERR]}, status=BAD_REQUEST_CODE)


class DetailService(ModelService):
  def __init__(self, model_cls: Type[SerializableModel], model_id: int, request):
    super().__init__(model_cls, request)
    self.model_id = model_id

  def read(self) -> JsonResponse:
    try:
      model = self.model_cls.objects.get(pk=self.model_id)
      return DataJsonResponse(model.serialize(**self.request.serializer_data))
    except self.model_cls.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(self.model_cls)]}, status=NOT_FOUND_CODE)

  @abc.abstractmethod
  def update(self) -> JsonResponse:
    raise NotImplementedError()

  def delete(self) -> JsonResponse:
    try:
      self.model_cls.objects.get(pk=self.model_id).delete()
      return JsonResponse({'msg': '{0} successfully deleted'.format(self.model_cls.__name__)})
    except self.model_cls.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(self.model_cls)]}, status=NOT_FOUND_CODE)
