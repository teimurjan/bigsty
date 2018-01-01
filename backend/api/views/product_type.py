from api.factories.services import ServiceType
from api.utils.langauges import LANGUAGES
from api.utils.validator import REQUIRED, MAX_LENGTH, SCHEMA, EMPTY
from api.views.base import ListView, DetailView


class ProductTypeListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.PRODUCT_TYPES, 'productTypes.', **kwargs)
    self.validation_rules = {
      'name': {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
      'description': {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 1000} for language in LANGUAGES}
      },
      'short_description': {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 300} for language in LANGUAGES}
      },
      'feature_values': {REQUIRED: True},
      'category': {REQUIRED: True},
      'image': {REQUIRED: True}
    }


class ProductTypeView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.PRODUCT_TYPE, 'productType.', **kwargs)
    self.validation_rules = {
      'name': {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
      'description': {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 1000} for language in LANGUAGES}
      },
      'short_description': {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 300} for language in LANGUAGES}
      },
      'feature_values': {REQUIRED: True},
      'category': {REQUIRED: True},
      'image': {REQUIRED: True}
    }
