from src.repos.feature_value import FeatureValueRepo
from src.services.feature_value import FeatureValueService
from src.repos.feature_value.name import FeatureValueNameRepo
from src.repos.feature_type import FeatureTypeRepo
from src.factories.policies.intl_texts import IntlTextsPolicyFactory


class FeatureValueServiceFactory:
    @staticmethod
    def create(db_conn):
        repo = FeatureValueRepo(db_conn)
        name_repo = FeatureValueNameRepo(db_conn)
        feature_type_repo = FeatureTypeRepo(db_conn)
        intl_texts_policy = IntlTextsPolicyFactory.create()
        return FeatureValueService(
            repo=repo,
            name_repo=name_repo,
            feature_type_repo=feature_type_repo,
            intl_texts_policy=intl_texts_policy,
        )
