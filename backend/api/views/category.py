from api.factories.services import ServiceType
from api.utils.langauges import LANGUAGES
from api.utils.validator import SCHEMA, REQUIRED, EMPTY, MAX_LENGTH
from api.views.base import ListView, DetailView


class CategoryListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.CATEGORIES, 'categories.', **kwargs)
    self.validation_rules = {
      'name': {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
      'feature_types': {REQUIRED: True}
    }


class CategoryView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.CATEGORY, 'category.', **kwargs)
    self.validation_rules = {
      'name': {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
      'feature_types': {REQUIRED: True}
    }
