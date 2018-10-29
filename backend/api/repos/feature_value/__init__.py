from api.models import FeatureValue
from api.repos.base import Repo


class FeatureValueRepo(Repo):
    def __init__(self):
        super().__init__(FeatureValue)

    def add_to_product_type(self, product_type, feature_value):
        fv = self._get_model_obj_by_id(feature_value.id)
        fv.product_types.add(product_type.id)

    def add_to_product(self, product, feature_value):
        fv = self._get_model_obj_by_id(feature_value.id)
        fv.products.add(product.id)