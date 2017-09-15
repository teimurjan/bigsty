from api.serializers import *


class SerializerFactory(object):
  USER = 'user'
  USERS = 'users'
  AUTH = 'auth'
  CATEGORY = 'category'
  CATEGORIES = 'categories'
  FEATURE_TYPE = 'feature_type'
  FEATURE_TYPES = 'feature_types'
  FEATURE_VALUE = 'feature_value'
  FEATURE_VALUES = 'feature_values'
  PRODUCT_TYPE = 'product_type'
  PRODUCT_TYPES = 'product_types'
  PRODUCT = 'product'
  PRODUCTS = 'products'
  _serializer_with_name = {
    USER: UserSerializer,
    USERS: UserListSerializer,
    AUTH: AuthSerializer,
    CATEGORY: CategorySerializer,
    CATEGORIES: CategoryListSerializer,
    FEATURE_TYPE: FeatureTypeSerializer,
    FEATURE_TYPES: FeatureTypeListSerializer,
    FEATURE_VALUE: FeatureValueSerializer,
    FEATURE_VALUES: FeatureValueListSerializer,
    PRODUCT_TYPE: ProductTypeSerializer,
    PRODUCT_TYPES: ProductTypeListSerializer,
    PRODUCT: ProductSerializer,
    PRODUCTS: ProductListSerializer
  }

  @staticmethod
  def create(name: str):
    return SerializerFactory._serializer_with_name[name]()
