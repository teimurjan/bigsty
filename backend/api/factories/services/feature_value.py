from api.repos.feature_value import FeatureValueRepo
from api.services.feature_value import FeatureValueService
from api.repos.feature_value.name import FeatureValueNameRepo
from api.repos.feature_type import FeatureTypeRepo
from api.factories.policies.intl_texts import IntlTextsPolicyFactory


class FeatureValueServiceFactory:
    @staticmethod
    def create():
        repo = FeatureValueRepo()
        name_repo = FeatureValueNameRepo()
        feature_type_repo = FeatureTypeRepo()
        intl_texts_policy = IntlTextsPolicyFactory.create()
        return FeatureValueService(
            repo=repo,
            name_repo=name_repo,
            feature_type_repo=feature_type_repo,
            intl_texts_policy=intl_texts_policy,
        )
