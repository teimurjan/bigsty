from api.repos.product import ProductRepo
from api.services.product import ProductService
from api.repos.product.image import ProductImageRepo
from api.repos.product_type import ProductTypeRepo
from api.repos.feature_value import FeatureValueRepo
from api.factories.policies.feature_values import FeatureValuesPolicyFactory


class ProductServiceFactory:
    @staticmethod
    def create():
        repo = ProductRepo()
        product_image_repo = ProductImageRepo()
        product_type_repo = ProductTypeRepo()
        feature_value_repo = FeatureValueRepo()
        feature_values_policy = FeatureValuesPolicyFactory.create()
        return ProductService(
            repo=repo,
            product_image_repo=product_image_repo,
            product_type_repo=product_type_repo,
            feature_value_repo=feature_value_repo,
            feature_values_policy=feature_values_policy,
        )
