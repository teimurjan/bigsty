from django.http import JsonResponse

from api.models import *
from api.models.utils import ModelToDictTransformer
from api.services.base import ListService, DetailService
from api.utils.json_responses import DataJsonResponse, JsonResponseBadRequest
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, INVALID_FEATURE_TYPE_ID_ERR
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields import NAME_FIELD, FEATURE_TYPE_FIELD
from api.utils.http_constants import NOT_FOUND_CODE, BAD_REQUEST_CODE


class FeatureTypeListService(ListService):
  def __init__(self, request):
    super().__init__(FeatureType, request)

  def create(self):
    data = self.request.parsed_data
    names = data[NAME_FIELD]
    feature_type = FeatureType.objects.create()
    feature_type.add_names(names)
    return DataJsonResponse(feature_type.serialize(**self.request.serializer_data))


class FeatureTypeService(DetailService):
  def __init__(self, model_id, request):
    super().__init__(FeatureType, model_id, request)

  def update(self):
    try:
      data = self.request.parsed_data
      feature_type = FeatureType.objects.get(pk=self.model_id)
      feature_type.update_names(data[NAME_FIELD])
      feature_type.save()
      return DataJsonResponse(feature_type.serialize(**self.request.serializer_data))
    except FeatureType.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureType)]}, status=NOT_FOUND_CODE)


class FeatureValueListService(ListService):
  def __init__(self, request):
    super().__init__(FeatureValue, request)

  def create(self):
    try:
      data = self.request.parsed_data
      feature_type = FeatureType.objects.get(pk=data[FEATURE_TYPE_FIELD])
      feature_value = FeatureValue.objects.create(feature_type=feature_type)
      feature_value.add_names(data[NAME_FIELD])
      return DataJsonResponse(feature_value.serialize(**self.request.serializer_data))
    except FeatureType.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(FeatureType)])


class FeatureValueService(DetailService):
  def __init__(self, model_id, transformer: ModelToDictTransformer):
    super().__init__(FeatureValue, model_id, transformer)

  def update(self):
    try:
      feature_value = FeatureValue.objects.get(pk=self.model_id)
      feature_value.name = self.data[NAME_FIELD]
      feature_value.feature_type = FeatureType.objects.get(pk=self.data[FEATURE_TYPE_FIELD])
      feature_value.save()
      return DataJsonResponse(self.transformer.handle(feature_value))
    except FeatureValue.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureValue)]}, status=NOT_FOUND_CODE)
    except FeatureType.DoesNotExist:
      return JsonResponse({FEATURE_TYPE_FIELD: [INVALID_FEATURE_TYPE_ID_ERR]}, status=BAD_REQUEST_CODE)
