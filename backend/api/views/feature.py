from api.factories.services import ServiceType
from api.utils.langauges import LANGUAGES
from api.utils.validator import REQUIRED, SCHEMA, EMPTY, MAX_LENGTH, TYPE
from api.views.base import ListView, DetailView


class FeatureTypeListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.FEATURE_TYPES, 'featureTypes.', **kwargs)
    self.validation_rules = {
      'name': {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
    }


class FeatureTypeView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.FEATURE_TYPE, 'featureType.', **kwargs)
    self.validation_rules = {
      'name': {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
    }


class FeatureValueListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.FEATURE_VALUES, 'featureValues.', **kwargs)
    self.validation_rules = {
      'name': {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
      'feature_type': {REQUIRED: True, TYPE: 'integer'}
    }


class FeatureValueView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.FEATURE_VALUE, 'featureValue.', **kwargs)
    self.validation_rules = {
      'name': {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
      'feature_type': {REQUIRED: True, TYPE: 'integer'}
    }
