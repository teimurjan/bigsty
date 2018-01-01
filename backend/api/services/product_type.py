from api.models import *
from api.services.base import ListService, DetailService
from api.utils.errors.error_constants import NOT_VALID_IMAGE
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.image_utils import base64_to_image, Base64ToImageConversionException
from api.utils.json_responses import DataJsonResponse, JsonResponseBadRequest, JsonResponseNotFound


class ProductTypeListService(ListService):
  def __init__(self, request):
    super().__init__(ProductType, request)

  def create(self):
    try:
      data = self.request.parsed_data
      category = Category.objects.get(pk=data['category'])
      feature_values = [FeatureValue.objects.get(pk=pk) for pk in data['feature_values']]
      ProductType.validate_relations(feature_values, category)
      names = data['name']
      descriptions = data['description']
      short_descriptions = data['short_description']
      image = base64_to_image(data['image'], names['en'])
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
      names = data['name']
      category = Category.objects.get(pk=data['category'])
      feature_values = [FeatureValue.objects.get(pk=pk) for pk in data['feature_values']]
      ProductType.validate_relations(feature_values, category)
      image = base64_to_image(data['image'], names['en'])
      product_type.image = image
      product_type.category = category
      product_type.update_names(names) \
        .update_short_descriptions(data['short_description']) \
        .update_descriptions(data['description']) \
        .feature_values.set(feature_values)
      return DataJsonResponse(product_type.serialize(**self.request.serializer_data))
    except ProductType.DoesNotExist:
      return JsonResponseNotFound([get_not_exist_msg(ProductType)])
    except FeatureValue.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(FeatureValue)])
    except Category.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(Category)])
    except (ProductType.SameFeatureValues, ProductType.FeatureValuesNotAcceptable):
      return JsonResponseBadRequest(['Invalid feature values'])
    except Base64ToImageConversionException:
      return JsonResponseBadRequest([NOT_VALID_IMAGE])
