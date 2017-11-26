from typing import Dict, Type

from api.services import *
from api.services.base import Service


class ServiceFactory:
  USER: str = 'user'
  USERS: str = 'users'
  AUTH: str = 'auth'
  CATEGORY: str = 'category'
  CATEGORIES: str = 'categories'
  FEATURE_TYPE: str = 'feature_type'
  FEATURE_TYPES: str = 'feature_types'
  FEATURE_VALUE: str = 'feature_value'
  FEATURE_VALUES: str = 'feature_values'
  PRODUCT_TYPE: str = 'product_type'
  PRODUCT_TYPES: str = 'product_types'
  PRODUCT: str = 'product'
  PRODUCTS: str = 'products'
  _name_to_serializer: Dict[str, Type[Service]] = {
    USER: UserService,
    USERS: UserListService,
    AUTH: AuthService,
    CATEGORY: CategoryService,
    CATEGORIES: CategoryListService,
    FEATURE_TYPE: FeatureTypeService,
    FEATURE_TYPES: FeatureTypeListService,
    FEATURE_VALUE: FeatureValueService,
    FEATURE_VALUES: FeatureValueListService,
    PRODUCT_TYPE: ProductTypeService,
    PRODUCT_TYPES: ProductTypeListService,
    PRODUCT: ProductService,
    PRODUCTS: ProductListService
  }

  @staticmethod
  def create(name: str, **kwargs) -> Service:
    return ServiceFactory._name_to_serializer[name](**kwargs)
