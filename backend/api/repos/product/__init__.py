from api.models import Product, ProductImage
from api.repos.base import Repo


class ProductRepo(Repo):
    def __init__(self):
        super().__init__(Product)

    def create(self, product_type, price, discount, quantity):
        return super()._create(
            product_type_id=product_type.id,
            price=price,
            discount=discount,
            quantity=quantity,
        )

    def update(self, product, product_type, price, discount, quantity):
        super()._update(
            product.id,
            product_type_id=product_type.id,
            price=price,
            discount=discount,
            quantity=quantity,
        )
        product.product_type = product_type
        product.price = price
        product.discount = discount
        product.quantity = quantity

    def set_feature_values(self, product, feature_values):
        model_obj = self._get_model_obj_by_id(product.id)
        product.feature_values = []
        feature_values_ids = set()
        for feature_value in feature_values:
            feature_values_ids.add(feature_value.id)
            product.feature_values.append(feature_value)
        model_obj.feature_values.set(feature_values_ids)
