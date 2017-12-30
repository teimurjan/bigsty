from api.factories.services import ServiceType
from api.utils.form_fields import NAME_FIELD, DESCRIPTION_FIELD, SHORT_DESCRIPTION_FIELD, \
  FEATURE_VALUES_FIELD, CATEGORY_FIELD, IMAGE_FIELD
from api.utils.langauges import LANGUAGES
from api.utils.validator import REQUIRED, MAX_LENGTH, SCHEMA, EMPTY
from api.views.base import ListView, DetailView


class ProductTypeListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.PRODUCT_TYPES, 'productTypes.', **kwargs)
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


class ProductTypeView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.PRODUCT_TYPE, 'productType.', **kwargs)
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
