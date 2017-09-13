import json

import jwt
from django.http import JsonResponse
from django.views.generic import View

from api.serializers import AuthSerializer, UserListSerializer, UserSerializer, CategoryListSerializer, \
  CategorySerializer, ProductTypeListSerializer, ProductTypeSerializer, \
  FeatureTypeListSerializer, FeatureTypeSerializer, FeatureValueListSerializer, FeatureValueSerializer, \
  ProductSerializer, ProductListSerializer
from api.utils.form_fields_constants import GROUP_FIELD, DATA_KEY, NAME_FIELD, EMAIL_FIELD, PASSWORD_FIELD, \
  FEATURE_TYPES_FIELD, DESCRIPTION_FIELD, SHORT_DESCRIPTION_FIELD, FEATURE_VALUES_FIELD, CATEGORY_FIELD, IMAGE_FIELD, \
  FEATURE_TYPE_FIELD, PRODUCT_TYPE_FIELD, IMAGES_FIELD, PRICE_FIELD, DISCOUNT_FIELD, QUANTITY_FIELD
from api.utils.langauges_costants import LANGUAGES
from api.utils.response_constants import BAD_REQUEST_CODE, FORBIDDEN_CODE, EMPTY_DATA_RESPONSE, \
  HTTP_AUTHORIZATION_HEADER
from api.utils.validator_utils import REQUIRED, EMPTY, IS_EMAIL, REGEX, BETWEEN, MAX_LENGTH, SCHEMA, MIN_VALUE, \
  SchemaValidator, ErrorHandler
from main import settings


def get_user_from_request(request):
  authorization = request.META[HTTP_AUTHORIZATION_HEADER].replace('Bearer ', '')
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


def parse_json(func):
  def wrapper(self, request, *args, **kwargs):
    try:
      json_data = request.body.decode()
      data = json.loads(json_data)
      if data is None: return EMPTY_DATA_RESPONSE
      self.parsed_data = data
    except Exception:
      return JsonResponse({}, status=BAD_REQUEST_CODE)
    return func(self, request, *args, **kwargs)

  return wrapper


def validation_required(func):
  def wrapper(self, request, *args, **kwargs):
    v = SchemaValidator(error_handler=ErrorHandler(prefix=self.error_prefix), schema=self.validation_rules)
    v.validate(self.parsed_data)
    if len(v.errors) > 0: return JsonResponse(v.errors, status=BAD_REQUEST_CODE)
    return func(self, request, *args, **kwargs)

  return wrapper


class BaseView(View):
  def __init__(self, serializer=None, validation_rules=None, **kwargs):
    super().__init__(**kwargs)
    self.serializer = serializer
    self.validation_rules = validation_rules
    self.parsed_data = None


class DetailView(BaseView):
  def get(self, request, model_id):
    self.serializer.model_id = model_id
    return self.serializer.read()

  @parse_json
  @validation_required
  def put(self, request, model_id, **kwargs):
    self.serializer.model_id = model_id
    self.serializer.data = self.parsed_data
    return self.serializer.update()

  def delete(self, request, model_id):
    self.serializer.model_id = model_id
    return self.serializer.delete()


class ListView(BaseView):
  @parse_json
  @validation_required
  def post(self, request, **kwargs):
    self.serializer.data = self.parsed_data
    return self.serializer.create()

  def get(self, request):
    return self.serializer.read(**request.GET.dict())


class LoginView(BaseView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = AuthSerializer()
    self.error_prefix = 'login.'
    self.validation_rules = {
      EMAIL_FIELD: {REQUIRED: True, EMPTY: False, IS_EMAIL: True},
      PASSWORD_FIELD: {REQUIRED: True, EMPTY: False, REGEX: r'[A-Za-z0-9@#$%^&+=]{8,}'}
    }

  @parse_json
  @validation_required
  def post(self, request, **kwargs):
    self.serializer.data = self.parsed_data
    return self.serializer.login()


class RegistrationView(BaseView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = AuthSerializer()
    self.error_prefix = 'registration.'
    self.validation_rules = {
      NAME_FIELD: {REQUIRED: True, EMPTY: False, BETWEEN: (1, 30)},
      EMAIL_FIELD: {REQUIRED: True, EMPTY: False, IS_EMAIL: True},
      PASSWORD_FIELD: {REQUIRED: True, EMPTY: False, REGEX: r'[A-Za-z0-9@#$%^&+=]{8,}'}
    }

  @parse_json
  @validation_required
  def post(self, request, **kwargs):
    self.serializer.data = self.parsed_data
    return self.serializer.register()


class UserListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = UserListSerializer()
    self.error_prefix = 'users.'
    self.validation_rules = {
      NAME_FIELD: {REQUIRED: True, EMPTY: False, BETWEEN: (1, 30)},
      EMAIL_FIELD: {REQUIRED: True, EMPTY: False, IS_EMAIL: True},
      PASSWORD_FIELD: {REQUIRED: True, EMPTY: False, REGEX: r'[A-Za-z0-9@#$%^&+=]{8,}'},
      GROUP_FIELD: {REQUIRED: True, EMPTY: False}
    }

  get = admin_required(ListView.get)
  post = admin_required(ListView.post)


class UserView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = UserSerializer()
    self.error_prefix = 'user.'
    self.validation_rules = {
      NAME_FIELD: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30},
      PASSWORD_FIELD: {REQUIRED: True, EMPTY: False, REGEX: r'[A-Za-z0-9@#$%^&+=]{8,}'},
      GROUP_FIELD: {REQUIRED: True, EMPTY: False}
    }

  get = admin_required(DetailView.get)
  put = admin_required(DetailView.put)
  delete = admin_required(DetailView.delete)


class CategoryListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = CategoryListSerializer()
    self.error_prefix = 'categories.'
    self.validation_rules = {
      NAME_FIELD: {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
      FEATURE_TYPES_FIELD: {REQUIRED: True}
    }

  post = admin_required(ListView.post)


class CategoryView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = CategorySerializer()
    self.error_prefix = 'category.'
    self.validation_rules = {
      NAME_FIELD: {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
      FEATURE_TYPES_FIELD: {REQUIRED: True}
    }

  put = admin_required(DetailView.put)
  delete = admin_required(DetailView.delete)


class ProductTypeListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = ProductTypeListSerializer()
    self.error_prefix = 'productTypes.'
    self.validation_rules = {
      NAME_FIELD: {REQUIRED: True, MAX_LENGTH: 30},
      DESCRIPTION_FIELD: {REQUIRED: True, MAX_LENGTH: 1000},
      SHORT_DESCRIPTION_FIELD: {REQUIRED: True, MAX_LENGTH: 100},
      FEATURE_VALUES_FIELD: {REQUIRED: True},
      CATEGORY_FIELD: {REQUIRED: True},
      IMAGE_FIELD: {REQUIRED: True}
    }

  post = admin_required(ListView.post)


class ProductTypeView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = ProductTypeSerializer()
    self.error_prefix = 'productType.'
    self.validation_rules = {
      NAME_FIELD: {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
      DESCRIPTION_FIELD: {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 1000} for language in LANGUAGES}
      },
      SHORT_DESCRIPTION_FIELD: {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 300} for language in LANGUAGES}
      },
      FEATURE_VALUES_FIELD: {REQUIRED: True},
      CATEGORY_FIELD: {REQUIRED: True},
      IMAGE_FIELD: {REQUIRED: True}
    }

  put = admin_required(DetailView.put)
  delete = admin_required(DetailView.delete)


class FeatureTypeListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = FeatureTypeListSerializer()
    self.error_prefix = 'featureTypes.'
    self.validation_rules = {
      NAME_FIELD: {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
    }

  post = admin_required(ListView.post)


class FeatureTypeView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = FeatureTypeSerializer()
    self.error_prefix = 'featureType.'
    self.validation_rules = {
      NAME_FIELD: {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
    }

  put = admin_required(DetailView.put)
  delete = admin_required(DetailView.delete)


class FeatureValueListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = FeatureValueListSerializer()
    self.error_prefix = 'featureValues.'
    self.validation_rules = {
      NAME_FIELD: {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
      FEATURE_TYPE_FIELD: {REQUIRED: True}
    }

  post = admin_required(ListView.post)


class FeatureValueView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = FeatureValueSerializer()
    self.error_prefix = 'featureValue.'
    self.validation_rules = {
      NAME_FIELD: {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
      FEATURE_TYPE_FIELD: {REQUIRED: True}
    }

  put = admin_required(DetailView.put)
  delete = admin_required(DetailView.delete)


class ProductView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = ProductSerializer()
    self.error_prefix = 'product.'
    self.validation_rules = {
      PRODUCT_TYPE_FIELD: {REQUIRED: True},
      IMAGES_FIELD: {REQUIRED: True},
      PRICE_FIELD: {REQUIRED: True, MIN_VALUE: 1},
      DISCOUNT_FIELD: {REQUIRED: True, BETWEEN: (1, 99)},
      QUANTITY_FIELD: {REQUIRED: True, MIN_VALUE: 0},
      FEATURE_VALUES_FIELD: {REQUIRED: True},
    }

  put = admin_required(DetailView.put)
  delete = admin_required(DetailView.delete)


class ProductListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.serializer = ProductListSerializer()
    self.error_prefix = 'products.'
    self.validation_rules = {
      PRODUCT_TYPE_FIELD: {REQUIRED: True},
      IMAGES_FIELD: {REQUIRED: True},
      PRICE_FIELD: {REQUIRED: True, MIN_VALUE: 1},
      DISCOUNT_FIELD: {REQUIRED: True, BETWEEN: (1, 99)},
      QUANTITY_FIELD: {REQUIRED: True, MIN_VALUE: 0},
      FEATURE_VALUES_FIELD: {REQUIRED: True},
    }

  post = admin_required(ListView.post)
