from src.repos.product import ProductRepo
from src.services.product import ProductService
from src.repos.product.image import ProductImageRepo
from src.repos.product_type import ProductTypeRepo
from src.repos.feature_value import FeatureValueRepo
from src.factories.policies.feature_values import FeatureValuesPolicyFactory


class ProductServiceFactory:
    @staticmethod
    def create():
        repo = ProductRepo(db_conn)
        product_image_repo = ProductImageRepo(db_conn)
        product_type_repo = ProductTypeRepo(db_conn)
        feature_value_repo = FeatureValueRepo(db_conn)
        feature_values_policy = FeatureValuesPolicyFactory.create()
        return ProductService(
            repo=repo,
            product_image_repo=product_image_repo,
            product_type_repo=product_type_repo,
            feature_value_repo=feature_value_repo,
            feature_values_policy=feature_values_policy,
        )
