from django.db import IntegrityError
from django.http import JsonResponse

from api.models import *
from api.models.utils import ModelToDictTransformer
from api.services.base import ListService, DetailService
from api.utils.json_responses import DataJsonResponse, JsonResponseBadRequest
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, NOT_VALID_IMAGE, \
  INVALID_FEATURE_TYPE_ID_ERR, \
  SAME_PRODUCT_TYPE_NAME_ERR
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields import NAME_FIELD, DESCRIPTION_FIELD, \
  IMAGE_FIELD, CATEGORY_FIELD, SHORT_DESCRIPTION_FIELD, FEATURE_VALUES_FIELD
from api.utils.image_utils import base64_to_image, Base64ToImageConversionException
from api.utils.http_constants import NOT_FOUND_CODE, BAD_REQUEST_CODE


class ProductTypeListService(ListService):
  def __init__(self, request):
    super().__init__(ProductType, request)

  def create(self):
    try:
      data = self.request.parsed_data
      category = Category.objects.get(pk=data[CATEGORY_FIELD])
      feature_values = [FeatureValue.objects.get(pk=pk) for pk in data[FEATURE_VALUES_FIELD]]
      ProductType.validate_relations(feature_values, category)
      names = data[NAME_FIELD]
      descriptions = data[DESCRIPTION_FIELD]
      short_descriptions = data[SHORT_DESCRIPTION_FIELD]
      image = base64_to_image(data[IMAGE_FIELD], names['en'])
      product_type = ProductType.objects.create(image=image, category=category) \
        .add_names(names).add_descriptions(descriptions).add_short_descriptions(short_descriptions)
      product_type.feature_values.set(feature_values)
      return DataJsonResponse(product_type.serialize(**self.request.serializer_data))
    except FeatureValue.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(FeatureValue)])
    except Category.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(Category)])
    except (ProductType.SameFeatureValues, ProductType.FeatureValuesNotAcceptable):
      return JsonResponseBadRequest(['Invalid feature values'])
    except Base64ToImageConversionException:
      return JsonResponseBadRequest([NOT_VALID_IMAGE])


class ProductTypeService(DetailService):
  def __init__(self, model_id, request):
    super().__init__(ProductType, model_id, request)

  def update(self):
    try:
      data = self.request.parsed_data
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
      return DataJsonResponse(self.transformer.handle(product_type))
    except ProductType.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(ProductType)]}, status=NOT_FOUND_CODE)
    except FeatureValue.DoesNotExist:
      return JsonResponse({FEATURE_VALUES_FIELD: [get_not_exist_msg(FeatureValue)]}, status=BAD_REQUEST_CODE)
    except Category.DoesNotExist:
      return JsonResponse({CATEGORY_FIELD: [get_not_exist_msg(Category)]}, status=BAD_REQUEST_CODE)
    except Base64ToImageConversionException:
      return JsonResponse({IMAGE_FIELD: [NOT_VALID_IMAGE]}, status=BAD_REQUEST_CODE)
    except IntegrityError as e:
      if 'Duplicate entry' in str(e):
        return JsonResponse({NAME_FIELD: [SAME_PRODUCT_TYPE_NAME_ERR]}, status=BAD_REQUEST_CODE)
