from enum import Enum
from typing import Dict, Type

from api.services import *
from api.services.base import Service
from api.services.group import GroupListService


class ServiceType(Enum):
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
  GROUPS: str = 'groups'


class ServiceFactory:
  _name_to_serializer: Dict[ServiceType, Type[Service]] = {
    ServiceType.USER: UserService,
    ServiceType.USERS: UserListService,
    ServiceType.AUTH: AuthService,
    ServiceType.CATEGORY: CategoryService,
    ServiceType.CATEGORIES: CategoryListService,
    ServiceType.FEATURE_TYPE: FeatureTypeService,
    ServiceType.FEATURE_TYPES: FeatureTypeListService,
    ServiceType.FEATURE_VALUE: FeatureValueService,
    ServiceType.FEATURE_VALUES: FeatureValueListService,
    ServiceType.PRODUCT_TYPE: ProductTypeService,
    ServiceType.PRODUCT_TYPES: ProductTypeListService,
    ServiceType.PRODUCT: ProductService,
    ServiceType.PRODUCTS: ProductListService,
    ServiceType.GROUPS: GroupListService,
  }

  @staticmethod
  def create(service_type: ServiceType, **kwargs) -> Service:
    return ServiceFactory._name_to_serializer[service_type](**kwargs)
