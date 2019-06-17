from src.repos.feature_type import FeatureTypeRepo
from src.services.feature_type import FeatureTypeService


class FeatureTypeServiceFactory:
    @staticmethod
    def create(db_conn):
        repo = FeatureTypeRepo(db_conn)
        return FeatureTypeService(repo=repo)
