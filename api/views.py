import json

import jwt
from django.http import JsonResponse
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
  def wrapper(self, request, *args, **kwargs):
    try:
      user = get_user_from_request(request)
      if user[GROUP_FIELD] != 'admin':
        return JsonResponse({}, status=FORBIDDEN_CODE)
    except Exception as e:
      return JsonResponse({}, status=FORBIDDEN_CODE)
    return func(self, request, *args, **kwargs)

  return wrapper


def validation_required(func):
  def wrapper(self, request, *args, **kwargs):
    json_data = request.body.decode()
    data = json.loads(json_data)
    if data is None:
      return EMPTY_DATA_RESPONSE
    self.validator.data = data
    self.validator.validate()
    if self.validator.has_errors():
      return JsonResponse(self.validator.errors, status=BAD_REQUEST_CODE)
    kwargs[DATA_KEY] = data
    return func(self, request, *args, **kwargs)

  return wrapper


class BaseView(View):
  def __init__(self, serializer=None, validator=None, **kwargs):
    super().__init__(**kwargs)
    self.serializer = serializer
    self.validator = validator


class DetailView(BaseView):
  def get(self, request, model_id):
    self.serializer.model_id = model_id
    return self.serializer.read()

  @admin_required
  @validation_required
  def put(self, request, model_id, **kwargs):
    self.serializer.model_id = model_id
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.update()

  @admin_required
  def delete(self, request, model_id):
    self.serializer.model_id = model_id
    return self.serializer.delete()


class ListView(BaseView):
  @admin_required
  @validation_required
  def post(self, request, *args, **kwargs):
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.create()

  def get(self, request):
    return self.serializer.read(**request.GET.dict())


class LoginView(BaseView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = AuthSerializer()
    self.validator = LoginFormValidator()

  @validation_required
  def post(self, request, *args, **kwargs):
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.login()


class RegistrationView(BaseView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = AuthSerializer()
    self.validator = RegistrationFormValidator()

  @validation_required
  def post(self, request, *args, **kwargs):
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.register()


class UserListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = UserListSerializer()
    self.validator = UserCreationFormValidator()

  @admin_required
  def get(self, request):
    return super().get(request)


class UserView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = UserSerializer()
    self.validator = UserUpdateFormValidator()

  @admin_required
  def get(self, request, model_id):
    return super().get(request, model_id)


class CategoryListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = CategoryListSerializer()
    self.validator = CategoryFormValidator()


class CategoryView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = CategorySerializer()
    self.validator = CategoryFormValidator()


class ProductTypeListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = ProductTypeListSerializer()
    self.validator = ProductTypeFormValidator()


class ProductTypeView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = ProductTypeSerializer()
    self.validator = ProductTypeFormValidator()


class FeatureTypeListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = FeatureTypeListSerializer()
    self.validator = FeatureTypeFormValidator()


class FeatureTypeView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = FeatureTypeSerializer()
    self.validator = FeatureTypeFormValidator()


class FeatureValueListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = FeatureValueListSerializer()
    self.validator = FeatureValueFormValidator()


class FeatureValueView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = FeatureValueSerializer()
    self.validator = FeatureValueFormValidator()


class ProductView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = ProductSerializer()
    self.validator = ProductFormValidator()


class ProductListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = ProductListSerializer()
    self.validator = ProductFormValidator()
