from api.repos.feature_value import FeatureValueRepo
from api.services.feature_value import FeatureValueService
from api.repos.feature_value.name import FeatureValueNameRepo
from api.repos.language import LanguageRepo
from api.repos.feature_type import FeatureTypeRepo


class FeatureValueServiceFactory:
    @staticmethod
    def create():
        repo = FeatureValueRepo()
        name_repo = FeatureValueNameRepo()
        language_repo = LanguageRepo()
        feature_type_repo = FeatureTypeRepo()
        return FeatureValueService(
            repo=repo,
            name_repo=name_repo,
            language_repo=language_repo,
            feature_type_repo=feature_type_repo,
        )
