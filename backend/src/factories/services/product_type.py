from flask import current_app as app

from src.repos.product_type import ProductTypeRepo
from src.services.product_type import ProductTypeService
from src.repos.category import CategoryRepo
from src.repos.feature_type import FeatureTypeRepo
from src.repos.feature_value import FeatureValueRepo
from src.policies.feature_values import FeatureValuesPolicy
from src.file_storage import FileStorage


class ProductTypeServiceFactory:
    @staticmethod
    def create(db_conn):
        file_storage = FileStorage(app.config['UPLOAD_FOLDER'])
        repo = ProductTypeRepo(db_conn, file_storage)
        category_repo = CategoryRepo(db_conn)
        feature_type_repo = FeatureTypeRepo(db_conn)
        feature_value_repo = FeatureValueRepo(db_conn)
        feature_values_policy = FeatureValuesPolicy(feature_type_repo)
        return ProductTypeService(
            repo=repo,
            category_repo=category_repo,
            feature_value_repo=feature_value_repo,
            feature_values_policy=feature_values_policy,
        )
