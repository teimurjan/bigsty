from api.models import FeatureTypeName
from api.repos.base import Repo


class FeatureTypeNameRepo(Repo):
    def __init__(self):
        super().__init__(FeatureTypeName)
