from flask import current_app as app

from src.file_storage import FileStorage
from src.policies.feature_values import FeatureValuesPolicy
from src.repos.feature_type import FeatureTypeRepo
from src.repos.feature_value import FeatureValueRepo
from src.repos.product import ProductRepo
from src.repos.product_type import ProductTypeRepo
from src.services.product import ProductService


class ProductServiceFactory:
    @staticmethod
    def create(db_conn):
        file_storage = FileStorage(app.config['UPLOAD_FOLDER'])
        repo = ProductRepo(db_conn, file_storage)
        product_type_repo = ProductTypeRepo(db_conn, file_storage)
        feature_type_repo = FeatureTypeRepo(db_conn)
        feature_value_repo = FeatureValueRepo(db_conn)
        feature_values_policy = FeatureValuesPolicy(feature_type_repo)
        return ProductService(
            repo=repo,
            product_type_repo=product_type_repo,
            feature_value_repo=feature_value_repo,
            feature_values_policy=feature_values_policy,
        )
