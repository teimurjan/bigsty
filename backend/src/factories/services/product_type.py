from src.repos.product_type import ProductTypeRepo
from src.services.product_type import ProductTypeService
from src.repos.product_type.name import ProductTypeNameRepo
from src.repos.product_type.description import ProductTypeDescriptionRepo
from src.repos.product_type.short_description import ProductTypeShortDescriptionRepo
from src.repos.category import CategoryRepo
from src.repos.feature_value import FeatureValueRepo
from src.factories.policies.intl_texts import IntlTextsPolicyFactory
from src.factories.policies.feature_values import FeatureValuesPolicyFactory


class ProductTypeServiceFactory:
    @staticmethod
    def create(db_conn):
        repo = ProductTypeRepo(db_conn)
        name_repo = ProductTypeNameRepo(db_conn)
        description_repo = ProductTypeDescriptionRepo(db_conn)
        short_description_repo = ProductTypeShortDescriptionRepo(db_conn)
        category_repo = CategoryRepo(db_conn)
        feature_value_repo = FeatureValueRepo(db_conn)
        intl_texts_policy = IntlTextsPolicyFactory.create()
        feature_values_policy = FeatureValuesPolicyFactory.create()
        return ProductTypeService(
            repo=repo,
            name_repo=name_repo,
            description_repo=description_repo,
            short_description_repo=short_description_repo,
            category_repo=category_repo,
            feature_value_repo=feature_value_repo,
            intl_texts_policy=intl_texts_policy,
            feature_values_policy=feature_values_policy,
        )
