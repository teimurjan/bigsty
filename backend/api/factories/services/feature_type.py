from api.repos.feature_type import FeatureTypeRepo
from api.services.feature_type import FeatureTypeService
from api.repos.feature_type.name import FeatureTypeNameRepo
from api.repos.language import LanguageRepo


class FeatureTypeServiceFactory:
    @staticmethod
    def create():
        repo = FeatureTypeRepo()
        name_repo = FeatureTypeNameRepo()
        language_repo = LanguageRepo()
        return FeatureTypeService(
            repo=repo,
            name_repo=name_repo,
            language_repo=language_repo
        )
