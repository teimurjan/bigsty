from api.factories.services import ServiceType
from api.utils.validator import REQUIRED, MIN_VALUE, BETWEEN
from api.views.base import DetailView, ListView


class ProductView(DetailView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.PRODUCT, 'product.', **kwargs)
    self.validation_rules = {
      'product_type': {REQUIRED: True},
      'images': {REQUIRED: True},
      'price': {REQUIRED: True, MIN_VALUE: 1},
      'discount': {REQUIRED: True, BETWEEN: (-1, 100)},
      'quantity': {REQUIRED: True, MIN_VALUE: 0},
      'feature_values': {REQUIRED: True},
    }


class ProductListView(ListView):
  def __init__(self, **kwargs):
    super().__init__(ServiceType.PRODUCTS, 'products.', **kwargs)
    self.validation_rules = {
      'product_type': {REQUIRED: True},
      'images': {REQUIRED: True},
      'price': {REQUIRED: True, MIN_VALUE: 1},
      'discount': {REQUIRED: True, BETWEEN: (-1, 100)},
      'quantity': {REQUIRED: True, MIN_VALUE: 0},
      'feature_values': {REQUIRED: True},
    }
