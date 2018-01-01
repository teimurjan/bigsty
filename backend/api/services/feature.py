from api.models import *
from api.services.base import ListService, DetailService
from api.utils.errors.error_messages import get_not_exist_msg

from api.utils.json_responses import DataJsonResponse, JsonResponseBadRequest, JsonResponseNotFound


class FeatureTypeListService(ListService):
  def __init__(self, request):
    super().__init__(FeatureType, request)

  def create(self):
    data = self.request.parsed_data
    names = data['name']
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
      feature_type.update_names(data['name'])
      feature_type.save()
      return DataJsonResponse(feature_type.serialize(**self.request.serializer_data))
    except FeatureType.DoesNotExist:
      return JsonResponseNotFound([get_not_exist_msg(FeatureType)])


class FeatureValueListService(ListService):
  def __init__(self, request):
    super().__init__(FeatureValue, request)

  def create(self):
    try:
      data = self.request.parsed_data
      feature_type = FeatureType.objects.get(pk=data['feature_type'])
      feature_value = FeatureValue.objects.create(feature_type=feature_type)
      feature_value.add_names(data['name'])
      return DataJsonResponse(feature_value.serialize(**self.request.serializer_data))
    except FeatureType.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(FeatureType)])


class FeatureValueService(DetailService):
  def __init__(self, model_id, request):
    super().__init__(FeatureValue, model_id, request)

  def update(self):
    try:
      data = self.request.parsed_data
      feature_value = FeatureValue.objects.get(pk=self.model_id)
      feature_type = FeatureType.objects.get(pk=data['feature_type'])
      feature_value.feature_type = feature_type
      feature_value.update_names(data['name'])
      feature_value.save()
      return DataJsonResponse(feature_value.serialize(**self.request.serializer_data))
    except FeatureValue.DoesNotExist:
      return JsonResponseNotFound([get_not_exist_msg(FeatureValue)])
    except FeatureType.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(FeatureType)])
