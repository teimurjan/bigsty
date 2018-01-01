from api.models import *
from api.services.base import DetailService, ListService
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.image_utils import base64_to_image, Base64ToImageConversionException
from api.utils.json_responses import DataJsonResponse, JsonResponseBadRequest, JsonResponseNotFound


class ProductService(DetailService):
  def __init__(self, model_id, request):
    super().__init__(Product, model_id, request)

  def update(self):
    try:
      data = self.request.parsed_data
      product = Product.objects.get(pk=self.model_id)
      product_type = ProductType.objects.get(pk=data['product_type'])
      feature_values = [FeatureValue.objects.get(pk=fv_id) for fv_id in data['feature_values']]
      Product.validate_relations(feature_values, product_type)
      product.product_type = product_type
      product.discount = data['discount']
      product.price = data['price']
      product.quantity = data['quantity']
      product.save()
      product.feature_values.set(feature_values)
      product.update_images(data['images'])
      return DataJsonResponse(product.serialize(**self.request.serializer_data))
    except Product.DoesNotExist:
      return JsonResponseNotFound([get_not_exist_msg(Product)])
    except ProductType.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(ProductType)])
    except (Product.FeatureValuesNotAcceptable, Product.FeatureValuesOfTheSameType):
      return JsonResponseBadRequest(['Invalid feature values'])
    except FeatureValue.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(FeatureValue)])
    except ProductImage.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(ProductImage)])
    except Base64ToImageConversionException:
      return JsonResponseBadRequest(key='images', err=['errors.product.images.notValidFormat'])


class ProductListService(ListService):
  def __init__(self, request):
    super().__init__(Product, request)

  def create(self):
    try:
      data = self.request.parsed_data
      product = Product()
      product_type = ProductType.objects.get(pk=data['product_type'])
      converted_images = [base64_to_image(image, product_type.__str__()) for image in data['images']]
      feature_values = [FeatureValue.objects.get(pk=fv_id) for fv_id in data['feature_values']]
      Product.validate_relations(feature_values, product_type)
      product.product_type = product_type
      product.discount = data['discount']
      product.price = data['price']
      product.quantity = data['quantity']
      product.save()
      product.feature_values.set(feature_values)
      product.images.set([ProductImage.objects.create(file=image, product=product) for image in converted_images])
      return DataJsonResponse(product.serialize(**self.request.serializer_data))
    except ProductType.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(ProductType)])
    except FeatureValue.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(FeatureValue)])
    except (Product.FeatureValuesNotAcceptable, Product.FeatureValuesOfTheSameType):
      return JsonResponseBadRequest(['Invalid feature values'])
    except Base64ToImageConversionException:
      return JsonResponseBadRequest(key='images', err=['errors.products.images.notValidFormat'])
