from src.repos.category import CategoryRepo
from src.services.category import CategoryService
from src.repos.feature_type import FeatureTypeRepo


class CategoryServiceFactory:
    @staticmethod
    def create(db_conn):
        repo = CategoryRepo(db_conn)
        feature_type_repo = FeatureTypeRepo(db_conn)
        return CategoryService(
            repo=repo,
            feature_type_repo=feature_type_repo,
        )
