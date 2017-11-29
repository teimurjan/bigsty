from api.factories.services import ServiceFactory
from api.utils.form_fields import PRODUCT_TYPE_FIELD, IMAGES_FIELD, PRICE_FIELD, DISCOUNT_FIELD, \
  QUANTITY_FIELD, FEATURE_VALUES_FIELD
from api.utils.validator import REQUIRED, MIN_VALUE, BETWEEN
from api.views.base import DetailView, ListView


class ProductView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(ServiceFactory.PRODUCT, 'product.', **kwargs)
    self.validation_rules = {
      PRODUCT_TYPE_FIELD: {REQUIRED: True},
      IMAGES_FIELD: {REQUIRED: True},
      PRICE_FIELD: {REQUIRED: True, MIN_VALUE: 1},
      DISCOUNT_FIELD: {REQUIRED: True, BETWEEN: (-1, 100)},
      QUANTITY_FIELD: {REQUIRED: True, MIN_VALUE: 0},
      FEATURE_VALUES_FIELD: {REQUIRED: True},
    }


class ProductListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(ServiceFactory.PRODUCTS, 'products.', **kwargs)
    self.validation_rules = {
      PRODUCT_TYPE_FIELD: {REQUIRED: True},
      IMAGES_FIELD: {REQUIRED: True},
      PRICE_FIELD: {REQUIRED: True, MIN_VALUE: 1},
      DISCOUNT_FIELD: {REQUIRED: True, BETWEEN: (-1, 100)},
      QUANTITY_FIELD: {REQUIRED: True, MIN_VALUE: 0},
      FEATURE_VALUES_FIELD: {REQUIRED: True},
    }
