import json

import jwt
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.generic import View

from api.serializers import AuthSerializer, UserListSerializer, UserSerializer, CategoryListSerializer, \
  CategorySerializer, ProductTypeListSerializer, ProductTypeSerializer, \
  FeatureTypeListSerializer, FeatureTypeSerializer, FeatureValueListSerializer, FeatureValueSerializer, \
  ProductSerializer, ProductListSerializer
from api.utils.form_fields_constants import GROUP_FIELD, DATA_KEY
from api.utils.response_constants import BAD_REQUEST_CODE, FORBIDDEN_CODE, EMPTY_DATA_RESPONSE
from api.validators import LoginFormValidator, RegistrationFormValidator, CategoryFormValidator, \
  UserCreationFormValidator, UserUpdateFormValidator, ProductTypeFormValidator, FeatureTypeFormValidator, \
  FeatureValueFormValidator, ProductFormValidator
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


def validator(Validator):
  def validate(func):
    def wrapper(request, *args, **kwargs):
      json_data = request.body.decode()
      data = json.loads(json_data)
      if data is None:
        return EMPTY_DATA_RESPONSE
      validator_ = Validator(data)
      validator_.validate()
      if validator_.has_errors():
        return JsonResponse(validator_.errors, status=BAD_REQUEST_CODE)
      kwargs[DATA_KEY] = data
      return func(request, *args, **kwargs)

    return wrapper

  return validate


class BaseView(View):
  @property
  def serializer(self):
    raise NotImplementedError

  def get(self, request, model_id):
    self.serializer.model_id = model_id
    return self.serializer.read()

  @method_decorator(admin_required)
  def delete(self, request, model_id):
    self.serializer.model_id = model_id
    return self.serializer.delete()


class ListView(View):
  @property
  def serializer(self):
    raise NotImplementedError

  def get(self, request):
    return self.serializer.read(**request.GET.dict())


class LoginView(BaseView):
  serializer = AuthSerializer()

  @method_decorator(validator(LoginFormValidator))
  def post(self, request, *args, **kwargs):
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.login()


class RegistrationView(BaseView):
  serializer = AuthSerializer()

  @method_decorator(validator(RegistrationFormValidator))
  def post(self, request, *args, **kwargs):
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.register()


class UserListView(ListView):
  serializer = UserListSerializer()

  @method_decorator(admin_required)
  def get(self, request):
    return super().get(request)

  @method_decorator(admin_required)
  @method_decorator(validator(UserCreationFormValidator))
  def post(self, request, *args, **kwargs):
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.create()


class UserView(BaseView):
  serializer = UserSerializer()

  @method_decorator(admin_required)
  def get(self, request, model_id):
    return super().get(request, model_id)

  @method_decorator(admin_required)
  @method_decorator(validator(UserUpdateFormValidator))
  def put(self, request, model_id, *args, **kwargs):
    self.serializer.model_id = model_id
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.update()


class CategoryListView(ListView):
  serializer = CategoryListSerializer()

  @method_decorator(admin_required)
  @method_decorator(validator(CategoryFormValidator))
  def post(self, request, *args, **kwargs):
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.create()


class CategoryView(BaseView):
  serializer = CategorySerializer()

  @method_decorator(admin_required)
  @method_decorator(validator(CategoryFormValidator))
  def put(self, request, model_id, **kwargs):
    self.serializer.model_id = model_id
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.update()


class ProductTypeListView(ListView):
  serializer = ProductTypeListSerializer()

  @method_decorator(admin_required)
  @method_decorator(validator(ProductTypeFormValidator))
  def post(self, request, **kwargs):
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.create()


class ProductTypeView(BaseView):
  serializer = ProductTypeSerializer()

  @method_decorator(admin_required)
  @method_decorator(validator(ProductTypeFormValidator))
  def put(self, request, model_id, **kwargs):
    self.serializer.model_id = model_id
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.update()


class FeatureTypeListView(ListView):
  serializer = FeatureTypeListSerializer()

  @method_decorator(admin_required)
  @method_decorator(validator(FeatureTypeFormValidator))
  def post(self, request, **kwargs):
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.create()


class FeatureTypeView(BaseView):
  serializer = FeatureTypeSerializer()

  @method_decorator(admin_required)
  @method_decorator(validator(FeatureTypeFormValidator))
  def put(self, request, model_id, **kwargs):
    self.serializer.model_id = model_id
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.update()


class FeatureValueListView(ListView):
  serializer = FeatureValueListSerializer()

  @method_decorator(admin_required)
  @method_decorator(validator(FeatureValueFormValidator))
  def post(self, request, **kwargs):
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.create()


class FeatureValueView(BaseView):
  serializer = FeatureValueSerializer()

  @method_decorator(admin_required)
  @method_decorator(validator(FeatureValueFormValidator))
  def put(self, request, model_id, **kwargs):
    self.serializer.data = kwargs[DATA_KEY]
    self.serializer.model_id = model_id
    return self.serializer.update()


class ProductView(BaseView):
  serializer = ProductSerializer()

  @method_decorator(admin_required)
  @method_decorator(validator(ProductFormValidator))
  def put(self, request, model_id, **kwargs):
    self.serializer.model_id = model_id
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.update()


class ProductListView(ListView):
  serializer = ProductListSerializer()
