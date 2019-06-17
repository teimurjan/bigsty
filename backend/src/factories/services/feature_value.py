from src.repos.feature_value import FeatureValueRepo
from src.services.feature_value import FeatureValueService
from src.repos.feature_type import FeatureTypeRepo


class FeatureValueServiceFactory:
    @staticmethod
    def create(db_conn):
        repo = FeatureValueRepo(db_conn)
        feature_type_repo = FeatureTypeRepo(db_conn)
        return FeatureValueService(
            repo=repo,
            feature_type_repo=feature_type_repo,
        )
