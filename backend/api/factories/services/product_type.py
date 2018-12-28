from api.repos.product_type import ProductTypeRepo
from api.services.product_type import ProductTypeService
from api.repos.product_type.name import ProductTypeNameRepo
from api.repos.product_type.description import ProductTypeDescriptionRepo
from api.repos.product_type.short_description import ProductTypeShortDescriptionRepo
from api.repos.category import CategoryRepo
from api.repos.feature_value import FeatureValueRepo
from api.factories.policies.intl_texts import IntlTextsPolicyFactory
from api.factories.policies.feature_values import FeatureValuesPolicyFactory


class ProductTypeServiceFactory:
    @staticmethod
    def create():
        repo = ProductTypeRepo()
        name_repo = ProductTypeNameRepo()
        description_repo = ProductTypeDescriptionRepo()
        short_description_repo = ProductTypeShortDescriptionRepo()
        category_repo = CategoryRepo()
        feature_value_repo = FeatureValueRepo()
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
