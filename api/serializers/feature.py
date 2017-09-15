from django.http import JsonResponse

from api.models import *
from api.serializers.base import ListSerializer, DataJsonResponse, DetailSerializer
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, INVALID_FEATURE_TYPE_ID_ERR
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields_constants import NAME_FIELD, FEATURE_TYPE_FIELD
from api.utils.response_constants import NOT_FOUND_CODE, BAD_REQUEST_CODE
from django.http import JsonResponse

from api.models import *
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, INVALID_FEATURE_TYPE_ID_ERR
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields_constants import NAME_FIELD, FEATURE_TYPE_FIELD
from api.utils.response_constants import NOT_FOUND_CODE, BAD_REQUEST_CODE


class FeatureTypeListSerializer(ListSerializer):
  def __init__(self):
    super().__init__(FeatureType)

  def create(self):
    feature_type = FeatureType.objects.create(name=self.data[NAME_FIELD])
    return DataJsonResponse(feature_type.to_dict())


class FeatureTypeSerializer(DetailSerializer):
  def __init__(self):
    super().__init__(FeatureType)

  def update(self):
    try:
      feature_type = FeatureType.objects.get(pk=self.model_id)
      feature_type.name = self.data[NAME_FIELD]
      feature_type.save()
      return DataJsonResponse(feature_type.to_dict())
    except FeatureType.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureType)]}, status=NOT_FOUND_CODE)


class FeatureValueListSerializer(ListSerializer):
  def __init__(self):
    super().__init__(FeatureValue)

  def create(self):
    try:
      feature_type = FeatureType.objects.get(pk=self.data[FEATURE_TYPE_FIELD])
      feature_value = FeatureValue.objects.create(name=self.data[NAME_FIELD], feature_type=feature_type)
      return DataJsonResponse(feature_value.to_dict())
    except FeatureType.DoesNotExist:
      return JsonResponse({FEATURE_TYPE_FIELD: [INVALID_FEATURE_TYPE_ID_ERR]}, status=BAD_REQUEST_CODE)


class FeatureValueSerializer(DetailSerializer):
  def __init__(self):
    super().__init__(FeatureValue)

  def update(self):
    try:
      feature_value = FeatureValue.objects.get(pk=self.model_id)
      feature_value.name = self.data[NAME_FIELD]
      feature_value.feature_type = FeatureType.objects.get(pk=self.data[FEATURE_TYPE_FIELD])
      feature_value.save()
      return DataJsonResponse(feature_value.to_dict())
    except FeatureValue.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureValue)]}, status=NOT_FOUND_CODE)
    except FeatureType.DoesNotExist:
      return JsonResponse({FEATURE_TYPE_FIELD: [INVALID_FEATURE_TYPE_ID_ERR]}, status=BAD_REQUEST_CODE)
