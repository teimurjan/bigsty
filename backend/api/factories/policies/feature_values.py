from api.repos.feature_type import FeatureTypeRepo
from api.policies.feature_values import FeatureValuesPolicy


class FeatureValuesPolicyFactory:
    @staticmethod
    def create():
        feature_type_repo = FeatureTypeRepo()
        return FeatureValuesPolicy(
            feature_type_repo=feature_type_repo
        )
