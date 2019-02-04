from src.repos.category import CategoryRepo
from services.category import CategoryService
from src.repos.category.name import CategoryNameRepo
from src.repos.feature_type import FeatureTypeRepo
from src.factories.policies.intl_texts import IntlTextsPolicyFactory


class CategoryServiceFactory:
    @staticmethod
    def create(db_conn):
        repo = CategoryRepo(db_conn)
        name_repo = CategoryNameRepo(db_conn)
        feature_type_repo = FeatureTypeRepo(db_conn)
        intl_texts_policy = IntlTextsPolicyFactory.create()
        return CategoryService(
            repo=repo,
            name_repo=name_repo,
            feature_type_repo=feature_type_repo,
            intl_texts_policy=intl_texts_policy,
        )
