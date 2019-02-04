from src.repos.feature_type import FeatureTypeRepo
from src.services.feature_type import FeatureTypeService
from src.repos.feature_type.name import FeatureTypeNameRepo
from src.factories.policies.intl_texts import IntlTextsPolicyFactory


class FeatureTypeServiceFactory:
    @staticmethod
    def create(db_conn):
        repo = FeatureTypeRepo(db_conn)
        name_repo = FeatureTypeNameRepo(db_conn)
        intl_texts_policy = IntlTextsPolicyFactory.create()
        return FeatureTypeService(
            repo=repo,
            name_repo=name_repo,
            intl_texts_policy=intl_texts_policy,
        )
