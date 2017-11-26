from api.factories.services import ServiceFactory
from api.utils.form_fields import NAME_FIELD, FEATURE_TYPES_FIELD
from api.utils.langauges import LANGUAGES
from api.utils.validator import SCHEMA, REQUIRED, EMPTY, MAX_LENGTH
from api.views.base import ListView, DetailView


class CategoryListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(ServiceFactory.CATEGORIES, 'categories.', **kwargs)
    self.validation_rules = {
      NAME_FIELD: {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
      FEATURE_TYPES_FIELD: {REQUIRED: True}
    }


class CategoryView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(ServiceFactory.CATEGORY, 'category.', **kwargs)
    self.validation_rules = {
      NAME_FIELD: {
        SCHEMA: {language: {REQUIRED: True, EMPTY: False, MAX_LENGTH: 30} for language in LANGUAGES}
      },
      FEATURE_TYPES_FIELD: {REQUIRED: True}
    }
