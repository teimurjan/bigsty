import abc

import jwt
from django.db import IntegrityError
from django.http import JsonResponse

from api.models import *
from api.utils.crypt import encrypt, matches
from api.utils.errors.error_constants import PASSWORD_DOESNT_MATCH_ERR, GLOBAL_ERR_KEY, NOT_VALID_IMAGE, \
  SAME_CATEGORY_NAME_ERR, SAME_EMAIL_ERR, INVALID_EMAIL_OR_PASSWORD_ERR, INVALID_FEATURE_TYPE_ID_ERR
from api.utils.form_fields_constants import NAME_FIELD, EMAIL_FIELD, PASSWORD_FIELD, DESCRIPTION_FIELD, \
  DISCOUNT_FIELD, QUANTITY_FIELD, IMAGE_FIELD, PRICE_FIELD, CATEGORY_FIELD, GROUP_FIELD, FEATURE_TYPES_FIELD, \
  SHORT_DESCRIPTION_FIELD, TOKEN_KEY, DATA_KEY, ID_FIELD, GROUP_FIELD, AUTH_FIELDS, FEATURE_VALUES_FIELD
from api.utils.response_constants import MESSAGE_OK, NOT_FOUND_CODE, BAD_REQUEST_CODE
from api.utils.errors.error_messages import get_not_exist_msg
from main import settings


def generate_token(user):
  payload = {ID_FIELD: user.pk, NAME_FIELD: user.name, GROUP_FIELD: user.group.name}
  return jwt.encode(payload, settings.SECRET_KEY).decode()


class ImageToBase64ConversionException(Exception):
  pass


def base64_to_image(data, file_name):
  try:
    import base64
    from django.core.files.base import ContentFile
    format, img_base64 = data.split(';base64,')
    type = format.split('/')[-1]
    if type != 'jpg' and type != 'png':
      raise ImageToBase64ConversionException
    return ContentFile(base64.b64decode(img_base64), name=file_name + '.' + type)
  except Exception:
    raise ImageToBase64ConversionException


class BaseSerializer:
  def __init__(self, data=None):
    if data:
      self.data = data


class ListSerializer(BaseSerializer):
  @abc.abstractmethod
  def create(self):
    return

  @abc.abstractmethod
  def read(self, **kwargs):
    return


class Serializer(BaseSerializer):
  def __init__(self, model_id, data=None):
    super().__init__(data)
    self.model_id = model_id

  @abc.abstractmethod
  def read(self):
    return

  @abc.abstractmethod
  def update(self):
    return

  @abc.abstractmethod
  def delete(self):
    return


class DataJsonResponse(JsonResponse):
  def __init__(self, data):
    super().__init__({DATA_KEY: data})


class AuthSerializer(BaseSerializer):
  def register(self):
    try:
      name = self.data[NAME_FIELD]
      email = self.data[EMAIL_FIELD]
      password = self.data[PASSWORD_FIELD]
      group, created = Group.objects.get_or_create(name='reader')
      user = User.objects.create(name=name, email=email, password=encrypt(password), group=group)
      return JsonResponse({TOKEN_KEY: generate_token(user)})
    except IntegrityError as e:
      if 'Duplicate entry' in str(e):
        return JsonResponse({EMAIL_FIELD: [SAME_EMAIL_ERR]}, status=BAD_REQUEST_CODE)

  def login(self):
    email = self.data[EMAIL_FIELD]
    password = self.data[PASSWORD_FIELD]
    try:
      user = User.objects.get(email=email)
    except User.DoesNotExist:
      return JsonResponse({AUTH_FIELDS: [INVALID_EMAIL_OR_PASSWORD_ERR]}, status=BAD_REQUEST_CODE)
    if matches(password, user.password):
      return JsonResponse({TOKEN_KEY: generate_token(user)})
    else:
      return JsonResponse({AUTH_FIELDS: [INVALID_EMAIL_OR_PASSWORD_ERR]}, status=BAD_REQUEST_CODE)


class UserSerializer(Serializer):
  def read(self):
    try:
      user = User.objects.get(pk=self.model_id)
      return DataJsonResponse(user.to_dict())
    except User.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(User)]}, status=NOT_FOUND_CODE)

  def update(self):
    try:
      user = User.objects.get(pk=self.model_id)
      user.name = self.data[NAME_FIELD] or user.name
      password = self.data[PASSWORD_FIELD]
      user.password = encrypt(password) or user.password
      user.group = Group.objects.get(pk=self.data[GROUP_FIELD]) or user.group
      return DataJsonResponse(user.to_dict())
    except User.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(User)]}, status=NOT_FOUND_CODE)
    except Group.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(Group)]}, status=BAD_REQUEST_CODE)

  def delete(self):
    try:
      User.objects.get(pk=self.model_id).delete()
      return JsonResponse(MESSAGE_OK)
    except User.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(User)]}, status=NOT_FOUND_CODE)


class UserListSerializer(ListSerializer):
  def create(self):
    try:
      group = Group.objects.get(pk=self.data[GROUP_FIELD])
      user = User.objects.create(name=self.data[NAME_FIELD], email=self.data[EMAIL_FIELD],
                                 password=self.data[PASSWORD_FIELD], group=group)
      return DataJsonResponse(user.to_dict())
    except Group.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(Group)]}, status=BAD_REQUEST_CODE)
    except IntegrityError as e:
      if 'Duplicate entry' in str(e):
        return JsonResponse({EMAIL_FIELD: [SAME_EMAIL_ERR]}, status=BAD_REQUEST_CODE)

  def read(self):
    return DataJsonResponse([user.to_dict() for user in User.objects.all()])


class CategoryListSerializer(ListSerializer):
  def read(self):
    return DataJsonResponse([category.to_dict() for category in Category.objects.all()])

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


class CategorySerializer(Serializer):
  def delete(self):
    try:
      Category.objects.get(pk=self.model_id).delete()
      return JsonResponse(MESSAGE_OK)
    except Category.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(Category)]}, status=NOT_FOUND_CODE)

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

  def read(self):
    try:
      category = Category.objects.get(pk=self.model_id)
      return JsonResponse({DATA_KEY: category.to_dict()})
    except Category.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(Category)]}, status=NOT_FOUND_CODE)


class ProductTypeListSerializer(ListSerializer):
  def create(self):
    try:
      name = self.data[NAME_FIELD]
      description = self.data[DESCRIPTION_FIELD]
      short_description = self.data[SHORT_DESCRIPTION_FIELD]
      image = self.data[IMAGE_FIELD]
      category = Category.objects.get(pk=self.data[CATEGORY_FIELD])
      possible_feature_values = FeatureValue.objects.filter(feature_type__categories__in=[category])
      feature_values = list()
      for feature_value_id in self.data[FEATURE_VALUES_FIELD]:
        feature_value = FeatureValue.objects.get(pk=feature_value_id)
        if feature_value not in possible_feature_values:
          return JsonResponse({FEATURE_VALUES_FIELD: [INVALID_FEATURE_TYPE_ID_ERR]}, status=BAD_REQUEST_CODE)
        feature_values.append(feature_value)
      image = base64_to_image(image, name)
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

  def read(self, **kwargs):
    filter_kwargs = {k: v for k, v in kwargs.items() if k is not None and v is not None}
    return DataJsonResponse([product_type.to_dict() for product_type in ProductType.objects.filter(**filter_kwargs)])


class ProductTypeSerializer(Serializer):
  def update(self):
    try:
      product_type = ProductType.objects.get(pk=self.model_id)
      name = self.data[NAME_FIELD]
      image = self.data[IMAGE_FIELD]
      self.data[IMAGE_FIELD] = base64_to_image(image, name)
      product_type.update(**self.data)
      return DataJsonResponse(product_type.to_dict())
    except ProductType.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(ProductType)]}, status=NOT_FOUND_CODE)
    except Exception as e:
      return JsonResponse({IMAGE_FIELD: NOT_VALID_IMAGE})

  def read(self):
    try:
      return ProductType.objects.get(pk=self.model_id)
    except ProductType.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(ProductType)]})

  def delete(self):
    try:
      ProductType.objects.get(pk=self.model_id).delete()
      return JsonResponse(MESSAGE_OK)
    except Category.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(ProductType)]}, status=NOT_FOUND_CODE)


class ProductListSerializer(ListSerializer):
  def create(self):
    name = self.data[NAME_FIELD]
    description = self.data[DESCRIPTION_FIELD]
    discount = self.data[DISCOUNT_FIELD]
    quantity = self.data[QUANTITY_FIELD]
    image = self.data[IMAGE_FIELD]
    price = self.data[PRICE_FIELD]
    category_id = self.data[CATEGORY_FIELD]
    try:
      image = base64_to_image(image, name)
    except Exception:
      return JsonResponse({IMAGE_FIELD: NOT_VALID_IMAGE})
    product = Product.objects.create(
      name=name,
      image=image,
      discount=discount,
      description=description,
      quantity=quantity,
      price=price,
      category_id=category_id
    )
    return JsonResponse({DATA_KEY: product.to_dict()})

  def read(self):
    response = {}
    category_id = self.data[CATEGORY_FIELD]
    if category_id:
      try:
        Category.objects.get(id=category_id)
        response[DATA_KEY] = [product.to_dict() for product in Product.objects.filter(category_id=category_id)]
      except Category.DoesNotExist:
        response[GLOBAL_ERR_KEY] = [get_not_exist_msg(Category)]
    else:
      response[DATA_KEY] = [product.to_dict() for product in Product.objects.all()]
    return JsonResponse(response)


class ProductSerializer(Serializer):
  def delete(self):
    pass

  def update(self):
    pass

  def read(self):
    try:
      product = Product.objects.get(pk=self.model_id)
      return JsonResponse({DATA_KEY: product.to_dict()})
    except Product.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(Product)]}, status=NOT_FOUND_CODE)


class FeatureTypeListSerializer(ListSerializer):
  def create(self):
    name = self.data[NAME_FIELD]
    feature_type = FeatureType.objects.create(name=name)
    return JsonResponse(feature_type.to_dict())

  def read(self):
    category_id = self.data[CATEGORY_FIELD]
    if category_id:
      try:
        Category.objects.get(id=category_id)
        feature_types = [feature_type.to_dict() for feature_type in FeatureType.objects.filter(category_id=category_id)]
        return JsonResponse({DATA_KEY: feature_types})
      except Category.DoesNotExist:
        return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(Category)]}, status=NOT_FOUND_CODE)
    else:
      feature_types = [feature_type.to_dict() for feature_type in FeatureType.objects.all()]
      return JsonResponse({DATA_KEY: feature_types})


class FeatureTypeSerializer(Serializer):
  def update(self):
    pass

  def delete(self):
    pass

  def read(self):
    try:
      feature_type = FeatureType.objects.get(pk=self.model_id)
      return JsonResponse({DATA_KEY: feature_type.to_dict()})
    except FeatureType.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(FeatureType)]}, status=NOT_FOUND_CODE)
