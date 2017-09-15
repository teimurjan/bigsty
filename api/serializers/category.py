from django.db import IntegrityError
from django.http import JsonResponse

from api.models import *
from api.serializers.base import ListSerializer, DataJsonResponse, DetailSerializer
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, SAME_CATEGORY_NAME_ERR
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields_constants import NAME_FIELD, FEATURE_TYPES_FIELD
from api.utils.response_constants import NOT_FOUND_CODE, BAD_REQUEST_CODE


class CategoryListSerializer(ListSerializer):
  def __init__(self):
    super().__init__(Category)

  def create(self):
    name = self.data[NAME_FIELD]
    feature_types_ids = self.data[FEATURE_TYPES_FIELD]
    try:
      feature_types = [FeatureType.objects.get(pk=feature_type_id) for feature_type_id in feature_types_ids]
      category = Category()
      category.name = name
      category.save()
      category.feature_types.add(*feature_types)
      return DataJsonResponse(category.to_dict())
    except FeatureType.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureType)]}, status=BAD_REQUEST_CODE)
    except IntegrityError as e:
      if 'Duplicate entry' in str(e):
        return JsonResponse({NAME_FIELD: [SAME_CATEGORY_NAME_ERR]}, status=BAD_REQUEST_CODE)


class CategorySerializer(DetailSerializer):
  def __init__(self):
    super().__init__(Category)

  def update(self):
    try:
      category = Category.objects.get(pk=self.model_id)
      name = self.data[NAME_FIELD]
      category.name = name
      feature_types_ids = self.data[FEATURE_TYPES_FIELD]
      feature_types = [FeatureType.objects.get(pk=feature_type_id) for feature_type_id in feature_types_ids]
      category.feature_types.set(feature_types)
      category.save()
      return DataJsonResponse(category.to_dict())
    except FeatureType.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureType)]}, status=NOT_FOUND_CODE)
    except Category.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(Category)]}, status=NOT_FOUND_CODE)
    except IntegrityError as e:
      if 'Duplicate entry' in str(e):
        return JsonResponse({NAME_FIELD: [SAME_CATEGORY_NAME_ERR]}, status=BAD_REQUEST_CODE)
