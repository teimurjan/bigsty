from api.models import ProductType
from api.repos.base import Repo


class ProductTypeRepo(Repo):
    def __init__(self):
        super().__init__(ProductType)

    def create(self, category, image):
        return super()._create(category_id=category.id, image=image)

    def update(self, product_type, category, image):
        updated_product_type = self._update(
            product_type.id,
            category_id=category.id,
            image=image
        )
        product_type.category = category
        product_type.image = updated_product_type.image

    def set_feature_values(self, product_type, feature_values):
        model_obj = self._get_model_obj_by_id(product_type.id)
        product_type.feature_values = []
        feature_values_ids = set()
        for feature_value in feature_values:
            feature_values_ids.add(feature_value.id)
            product_type.feature_values.append(feature_value)
        model_obj.feature_values.set(feature_values_ids)

    def get_by_category_id(self, category_id):
        return self.filter_by(category_id=category_id)
