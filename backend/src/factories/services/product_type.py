from flask import current_app as app

from src.repos.product_type import ProductTypeRepo
from src.services.product_type import ProductTypeService
from src.repos.category import CategoryRepo
from src.repos.feature_type import FeatureTypeRepo
from src.file_storage import FileStorage


class ProductTypeServiceFactory:
    @staticmethod
    def create(db_conn):
        file_storage = FileStorage(app.config['UPLOAD_FOLDER'])
        repo = ProductTypeRepo(db_conn, file_storage)
        category_repo = CategoryRepo(db_conn)
        feature_type_repo = FeatureTypeRepo(db_conn)
        return ProductTypeService(
            repo=repo,
            category_repo=category_repo,
            feature_type_repo=feature_type_repo,
        )
