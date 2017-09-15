from django.http import JsonResponse

from api.models import *
from api.serializers.base import DetailSerializer, DataJsonResponse, ListSerializer
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, NOT_VALID_IMAGE, \
  INVALID_FEATURE_TYPE_ID_ERR
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields_constants import DISCOUNT_FIELD, QUANTITY_FIELD, PRICE_FIELD, FEATURE_VALUES_FIELD, \
  PRODUCT_TYPE_FIELD, IMAGES_FIELD
from api.utils.image_utils import base64_to_image, ImageToBase64ConversionException
from api.utils.response_constants import NOT_FOUND_CODE, BAD_REQUEST_CODE


class ProductSerializer(DetailSerializer):
  def __init__(self):
    super().__init__(Product)

  def update(self):
    try:
      product = Product.objects.get(pk=self.model_id)
      discount = self.data[DISCOUNT_FIELD]
      price = self.data[PRICE_FIELD]
      quantity = self.data[QUANTITY_FIELD]
      product_type = ProductType.objects.get(pk=self.data[PRODUCT_TYPE_FIELD])
      product_images = list()

      for image in self.data[IMAGES_FIELD]:
        product_images.append(ProductImage(product=product, file=base64_to_image(image, product_type.name)))

      possible_feature_values = FeatureValue.objects.filter(product_types__in=[product_type])
      feature_values = list()
      for feature_value_id in self.data[FEATURE_VALUES_FIELD]:
        feature_value = FeatureValue.objects.get(pk=feature_value_id)
        feature_value_of_the_same_feature_type = \
          feature_value.feature_type in [added_feature_value.feature_type for added_feature_value in feature_values]
        if feature_value not in possible_feature_values or feature_value_of_the_same_feature_type:
          return JsonResponse({FEATURE_VALUES_FIELD: [INVALID_FEATURE_TYPE_ID_ERR]}, status=BAD_REQUEST_CODE)
        feature_values.append(feature_value)

      product.discount = discount
      product.price = price
      product.quantity = quantity
      product.product_type = product_type
      product.feature_values.set(feature_values)
      product.images.set(product_images, bulk=False)
      product.save()
      return DataJsonResponse(product.to_dict())
    except Product.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(Product)]}, status=NOT_FOUND_CODE)
    except ProductType.DoesNotExist:
      return JsonResponse({PRODUCT_TYPE_FIELD: [get_not_exist_msg(ProductType)]}, status=BAD_REQUEST_CODE)
    except FeatureValue.DoesNotExist:
      return JsonResponse({FEATURE_VALUES_FIELD: [get_not_exist_msg(FeatureValue)]}, status=BAD_REQUEST_CODE)
    except ImageToBase64ConversionException:
      return JsonResponse({IMAGES_FIELD: [NOT_VALID_IMAGE]}, status=BAD_REQUEST_CODE)


class ProductListSerializer(ListSerializer):
  def __init__(self):
    super().__init__(Product)

  def create(self):
    try:
      product = Product()
      discount = self.data[DISCOUNT_FIELD]
      price = self.data[PRICE_FIELD]
      quantity = self.data[QUANTITY_FIELD]
      product_type = ProductType.objects.get(pk=self.data[PRODUCT_TYPE_FIELD])

      possible_feature_values = FeatureValue.objects.filter(product_types__in=[product_type])
      feature_values = list()
      for feature_value_id in self.data[FEATURE_VALUES_FIELD]:
        feature_value = FeatureValue.objects.get(pk=feature_value_id)
        feature_value_of_the_same_feature_type = \
          feature_value.feature_type in [added_feature_value.feature_type for added_feature_value in feature_values]
        if feature_value not in possible_feature_values or feature_value_of_the_same_feature_type:
          return JsonResponse({FEATURE_VALUES_FIELD: [INVALID_FEATURE_TYPE_ID_ERR]}, status=BAD_REQUEST_CODE)
        feature_values.append(feature_value)
      converted_images = [base64_to_image(image, product_type.name) for image in self.data[IMAGES_FIELD]]

      product.discount = discount
      product.price = price
      product.quantity = quantity
      product.product_type = product_type
      product.save()
      product.feature_values.set(feature_values)
      product.images.set([ProductImage.objects.create(file=image, product=product) for image in converted_images])
      return DataJsonResponse(product.to_dict())
    except ProductType.DoesNotExist:
      return JsonResponse({PRODUCT_TYPE_FIELD: [get_not_exist_msg(ProductType)]}, status=BAD_REQUEST_CODE)
    except FeatureValue.DoesNotExist:
      return JsonResponse({FEATURE_VALUES_FIELD: [get_not_exist_msg(FeatureValue)]}, status=BAD_REQUEST_CODE)
    except ImageToBase64ConversionException:
      return JsonResponse({IMAGES_FIELD: [NOT_VALID_IMAGE]}, status=BAD_REQUEST_CODE)
