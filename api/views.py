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

  @validation_required
  def put(self, request, model_id, **kwargs):
    self.serializer.model_id = model_id
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.update()

  def delete(self, request, model_id):
    self.serializer.model_id = model_id
    return self.serializer.delete()


class ListView(BaseView):
  @validation_required
  def post(self, request, **kwargs):
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
  def post(self, request, **kwargs):
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.login()


class RegistrationView(BaseView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = AuthSerializer()
    self.validator = RegistrationFormValidator()

  @validation_required
  def post(self, request, **kwargs):
    self.serializer.data = kwargs[DATA_KEY]
    return self.serializer.register()


class UserListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = UserListSerializer()
    self.validator = UserCreationFormValidator()

  get = admin_required(ListView.get)
  post = admin_required(ListView.post)


class UserView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = UserSerializer()
    self.validator = UserUpdateFormValidator()

  get = admin_required(DetailView.get)
  put = admin_required(DetailView.put)
  delete = admin_required(DetailView.delete)


class CategoryListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = CategoryListSerializer()
    self.validator = CategoryFormValidator()

  post = admin_required(ListView.post)


class CategoryView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = CategorySerializer()
    self.validator = CategoryFormValidator()

  put = admin_required(DetailView.put)
  delete = admin_required(DetailView.delete)


class ProductTypeListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = ProductTypeListSerializer()
    self.validator = ProductTypeFormValidator()

  post = admin_required(ListView.post)


class ProductTypeView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = ProductTypeSerializer()
    self.validator = ProductTypeFormValidator()

  put = admin_required(DetailView.put)
  delete = admin_required(DetailView.delete)


class FeatureTypeListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = FeatureTypeListSerializer()
    self.validator = FeatureTypeFormValidator()

  post = admin_required(ListView.post)


class FeatureTypeView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = FeatureTypeSerializer()
    self.validator = FeatureTypeFormValidator()

  put = admin_required(DetailView.put)
  delete = admin_required(DetailView.delete)


class FeatureValueListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = FeatureValueListSerializer()
    self.validator = FeatureValueFormValidator()

  post = admin_required(ListView.post)


class FeatureValueView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = FeatureValueSerializer()
    self.validator = FeatureValueFormValidator()

  put = admin_required(DetailView.put)
  delete = admin_required(DetailView.delete)


class ProductView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = ProductSerializer()
    self.validator = ProductFormValidator()

  put = admin_required(DetailView.put)
  delete = admin_required(DetailView.delete)


class ProductListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = ProductListSerializer()
    self.validator = ProductFormValidator()

  post = admin_required(ListView.post)
