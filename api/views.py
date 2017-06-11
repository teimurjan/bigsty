import jwt
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.generic import View

from api.serializers import AuthSerializer, UserListSerializer, UserSerializer, CategoryListSerializer, \
  CategorySerializer, ProductListSerializer, ProductSerializer
import json

from api.utils.response_constants import GROUP_JSON_KEY, ID_JSON_KEY, BAD_REQUEST_CODE, FORBIDDEN_CODE
from api.validators import LoginFormValidator, RegistrationFormValidator, CategoryFormValidator, ProductFormValidator
from main import settings


def get_user_from_request(request):
  authorization = request.META['HTTP_AUTHORIZATION'].replace('Bearer ', '')
  return jwt.decode(authorization, settings.SECRET_KEY)


def admin_required(func):
  def wrapper(request, *args, **kwargs):
    user = get_user_from_request(request)
    if user[GROUP_JSON_KEY] != 'admin':
      return JsonResponse({}, status=FORBIDDEN_CODE)
    return func(request, *args, *kwargs)
  return wrapper


class LoginView(View):
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
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


class UserView(View):
  @method_decorator(admin_required)
  def delete(self, request, user_id):
    serializer = UserSerializer({ID_JSON_KEY: user_id})
    return serializer.delete()


class CategoryListView(View):
  def get(self, request):
    serializer = CategoryListSerializer()
    return serializer.read()

  @method_decorator(admin_required)
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    validator = CategoryFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=BAD_REQUEST_CODE)
    serializer = CategoryListSerializer(data)
    return serializer.create()


class CategoryView(View):
  def get(self, request, category_id):
    serializer = CategorySerializer({ID_JSON_KEY: category_id})
    return serializer.read()


class ProductListView(View):
  def get(self, request, category_id=None):
    serializer = ProductListSerializer({ID_JSON_KEY: category_id})
    return serializer.read()

  @method_decorator(admin_required)
  def post(self, request):
    json_data = request.body.decode()
    data = json.loads(json_data)
    validator = ProductFormValidator(data)
    validator.validate()
    if validator.has_errors():
      return JsonResponse(validator.errors, status=BAD_REQUEST_CODE)
    serializer = ProductListSerializer(data)
    return serializer.create()


class ProductView(View):
  def get(self, request, product_id):
    serializer = ProductSerializer({ID_JSON_KEY: product_id})
    return serializer.read()
