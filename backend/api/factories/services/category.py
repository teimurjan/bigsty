from api.repos.category import CategoryRepo
from api.services.category import CategoryService
from api.repos.category.name import CategoryNameRepo
from api.repos.feature_type import FeatureTypeRepo
from api.factories.policies.intl_texts import IntlTextsPolicyFactory


class CategoryServiceFactory:
    @staticmethod
    def create():
        repo = CategoryRepo()
        name_repo = CategoryNameRepo()
        feature_type_repo = FeatureTypeRepo()
        intl_texts_policy = IntlTextsPolicyFactory.create()
        return CategoryService(
            repo=repo,
            name_repo=name_repo,
            feature_type_repo=feature_type_repo,
            intl_texts_policy=intl_texts_policy,
        )
