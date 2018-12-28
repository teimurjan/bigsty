from api.repos.feature_type import FeatureTypeRepo
from api.services.feature_type import FeatureTypeService
from api.repos.feature_type.name import FeatureTypeNameRepo
from api.factories.policies.intl_texts import IntlTextsPolicyFactory


class FeatureTypeServiceFactory:
    @staticmethod
    def create():
        repo = FeatureTypeRepo()
        name_repo = FeatureTypeNameRepo()
        intl_texts_policy = IntlTextsPolicyFactory.create()
        return FeatureTypeService(
            repo=repo,
            name_repo=name_repo,
            intl_texts_policy=intl_texts_policy,
        )
