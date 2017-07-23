import json

import jwt
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.generic import View

from api.serializers import AuthSerializer, UserListSerializer, UserSerializer, CategoryListSerializer, \
  CategorySerializer, ProductListSerializer, ProductTypeListSerializer, ProductTypeSerializer, FeatureTypeListSerializer
from api.utils.form_fields_constants import ID_FIELD, GROUP_FIELD
from api.utils.response_constants import BAD_REQUEST_CODE, FORBIDDEN_CODE, EMPTY_DATA_RESPONSE
from api.validators import LoginFormValidator, RegistrationFormValidator, CategoryFormValidator, \
  ProductFormValidator, \
  UserCreationFormValidator, UserUpdateFormValidator, ProductTypeFormValidator, FeatureTypeFormValidator
from main import settings


def get_user_from_request(request):
  authorization = request.META['HTTP_AUTHORIZATION'].replace('Bearer ', '')
  return jwt.decode(authorization, settings.SECRET_KEY)


def admin_required(func):
  def wrapper(request, *args, **kwargs):
    try:
      user = get_user_from_request(request)
      if user[GROUP_FIELD] != 'admin':
        return JsonResponse({}, status=FORBIDDEN_CODE)
    except Exception as e:
      return JsonResponse({}, status=FORBIDDEN_CODE)
    return func(request, *args, **kwargs)

  return wrapper


class LoginView(View):
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    if data is None:
      return EMPTY_DATA_RESPONSE
    validator = LoginFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=BAD_REQUEST_CODE)
    serializer = AuthSerializer(data)
    return serializer.login()


class RegistrationView(View):
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    if data is None:
      return EMPTY_DATA_RESPONSE
    validator = RegistrationFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=BAD_REQUEST_CODE)
    serializer = AuthSerializer(data)
    return serializer.register()


class UserListView(View):
  @method_decorator(admin_required)
  def get(self, request):
    serializer = UserListSerializer()
    return serializer.read()

  @method_decorator(admin_required)
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    if data is None:
      return EMPTY_DATA_RESPONSE
    validator = UserCreationFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=BAD_REQUEST_CODE)
    serializer = UserListSerializer(data)
    return serializer.create()


class UserView(View):
  @method_decorator(admin_required)
  def get(self, request, user_id):
    serializer = UserSerializer(user_id)
    return serializer.read()

  @method_decorator(admin_required)
  def put(self, request, user_id):
    json_data = request.body.decode()
    data = json.loads(json_data)
    if data is None:
      return EMPTY_DATA_RESPONSE
    validator = UserUpdateFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=BAD_REQUEST_CODE)
    serializer = UserSerializer(user_id, data)
    return serializer.update()

  @method_decorator(admin_required)
  def delete(self, request, user_id):
    serializer = UserSerializer(user_id)
    return serializer.delete()


class CategoryListView(View):
  def get(self, request):
    serializer = CategoryListSerializer()
    return serializer.read()

  @method_decorator(admin_required)
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    if data is None:
      return EMPTY_DATA_RESPONSE
    validator = CategoryFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=BAD_REQUEST_CODE)
    serializer = CategoryListSerializer(data)
    return serializer.create()


class CategoryView(View):
  def get(self, request, category_id):
    serializer = CategorySerializer(category_id)
    return serializer.read()

  @method_decorator(admin_required)
  def put(self, request, category_id):
    json_data = request.body.decode()
    data = json.loads(json_data)
    if data is None:
      return EMPTY_DATA_RESPONSE
    validator = CategoryFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=BAD_REQUEST_CODE)
    serializer = CategorySerializer(category_id, data)
    return serializer.update()

  @method_decorator(admin_required)
  def delete(self, request, category_id):
    serializer = CategorySerializer(category_id)
    return serializer.delete()


class ProductListView(View):
  def get(self, request, category_id=None):
    serializer = ProductListSerializer({ID_FIELD: category_id})
    return serializer.read()

  @method_decorator(admin_required)
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    if data is None:
      return EMPTY_DATA_RESPONSE
    validator = ProductFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=BAD_REQUEST_CODE)
    serializer = ProductListSerializer(data)
    return serializer.create()


class ProductTypeListView(View):
  @method_decorator(admin_required)
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    if data is None:
      return EMPTY_DATA_RESPONSE
    validator = ProductTypeFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=BAD_REQUEST_CODE)
    serializer = ProductTypeListSerializer(data)
    return serializer.create()

  def get(self, request, category_id=None):
    serializer = ProductTypeListSerializer()
    return serializer.read(category_id=category_id)


class ProductTypeView(View):
  def get(self, request, product_type_id):
    serializer = ProductTypeSerializer(product_type_id)
    return serializer.read()

  @method_decorator(admin_required)
  def put(self, request, product_type_id):
    json_data = request.body.decode()
    data = json.loads(json_data)
    if data is None:
      return EMPTY_DATA_RESPONSE
    validator = ProductTypeFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=BAD_REQUEST_CODE)
    serializer = ProductTypeSerializer(model_id=product_type_id, data=data)
    return serializer.update()

  @method_decorator(admin_required)
  def delete(self, request, product_type_id):
    serializer = ProductTypeSerializer(product_type_id)
    return serializer.delete()


class FeatureTypeListView(View):
  def get(self, request):
    serializer = FeatureTypeListSerializer()
    return serializer.read()

  @method_decorator(admin_required)
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    if data is None:
      return EMPTY_DATA_RESPONSE
    validator = FeatureTypeFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=BAD_REQUEST_CODE)
    serializer = FeatureTypeListSerializer(data)
    return serializer.create()
