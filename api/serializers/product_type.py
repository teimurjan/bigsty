from django.db import IntegrityError
from django.http import JsonResponse

from api.models import *
from api.serializers.base import ListSerializer, DataJsonResponse, DetailSerializer
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, NOT_VALID_IMAGE, \
  INVALID_FEATURE_TYPE_ID_ERR, \
  SAME_PRODUCT_TYPE_NAME_ERR
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields_constants import NAME_FIELD, DESCRIPTION_FIELD, \
  IMAGE_FIELD, CATEGORY_FIELD, SHORT_DESCRIPTION_FIELD, FEATURE_VALUES_FIELD
from api.utils.image_utils import base64_to_image, ImageToBase64ConversionException
from api.utils.response_constants import NOT_FOUND_CODE, BAD_REQUEST_CODE


class ProductTypeListSerializer(ListSerializer):
  def __init__(self):
    super().__init__(ProductType)

  def create(self):
    try:
      name = self.data[NAME_FIELD]
      description = self.data[DESCRIPTION_FIELD]
      short_description = self.data[SHORT_DESCRIPTION_FIELD]
      category = Category.objects.get(pk=self.data[CATEGORY_FIELD])
      possible_feature_values = FeatureValue.objects.filter(feature_type__categories__in=[category])
      feature_values = list()
      for feature_value_id in self.data[FEATURE_VALUES_FIELD]:
        feature_value = FeatureValue.objects.get(pk=feature_value_id)
        if feature_value not in possible_feature_values and feature_value not in feature_values:
          return JsonResponse({FEATURE_VALUES_FIELD: [INVALID_FEATURE_TYPE_ID_ERR]}, status=BAD_REQUEST_CODE)
        feature_values.append(feature_value)
      image = base64_to_image(self.data[IMAGE_FIELD], name)
      product_type = ProductType.objects.create(name=name,
                                                description=description,
                                                short_description=short_description,
                                                image=image,
                                                category=category)
      product_type.feature_values.set(feature_values)
      return DataJsonResponse(product_type.to_dict())
    except FeatureValue.DoesNotExist:
      return JsonResponse({FEATURE_VALUES_FIELD: [get_not_exist_msg(FeatureValue)]}, status=BAD_REQUEST_CODE)
    except Category.DoesNotExist:
      return JsonResponse({CATEGORY_FIELD: [get_not_exist_msg(Category)]}, status=BAD_REQUEST_CODE)
    except ImageToBase64ConversionException:
      return JsonResponse({IMAGE_FIELD: [NOT_VALID_IMAGE]}, status=BAD_REQUEST_CODE)


class ProductTypeSerializer(DetailSerializer):
  def __init__(self):
    super().__init__(ProductType)

  def update(self):
    try:
      product_type = ProductType.objects.get(pk=self.model_id)
      name = self.data[NAME_FIELD]
      category = Category.objects.get(pk=self.data[CATEGORY_FIELD])
      possible_feature_values = FeatureValue.objects.filter(feature_type__categories__in=[category])
      feature_values = list()
      for feature_value_id in self.data[FEATURE_VALUES_FIELD]:
        feature_value = FeatureValue.objects.get(pk=feature_value_id)
        if feature_value not in possible_feature_values and feature_value not in feature_values:
          return JsonResponse({FEATURE_VALUES_FIELD: [INVALID_FEATURE_TYPE_ID_ERR]}, status=BAD_REQUEST_CODE)
        feature_values.append(feature_value)
      image = base64_to_image(self.data[IMAGE_FIELD], name)
      product_type.name = name
      product_type.description = self.data[DESCRIPTION_FIELD]
      product_type.short_description = self.data[SHORT_DESCRIPTION_FIELD]
      product_type.image = image
      product_type.category = category
      product_type.feature_values.set(feature_values)
      product_type.save()
      return DataJsonResponse(product_type.to_dict())
    except ProductType.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(ProductType)]}, status=NOT_FOUND_CODE)
    except FeatureValue.DoesNotExist:
      return JsonResponse({FEATURE_VALUES_FIELD: [get_not_exist_msg(FeatureValue)]}, status=BAD_REQUEST_CODE)
    except Category.DoesNotExist:
      return JsonResponse({CATEGORY_FIELD: [get_not_exist_msg(Category)]}, status=BAD_REQUEST_CODE)
    except ImageToBase64ConversionException:
      return JsonResponse({IMAGE_FIELD: [NOT_VALID_IMAGE]}, status=BAD_REQUEST_CODE)
    except IntegrityError as e:
      if 'Duplicate entry' in str(e):
        return JsonResponse({NAME_FIELD: [SAME_PRODUCT_TYPE_NAME_ERR]}, status=BAD_REQUEST_CODE)