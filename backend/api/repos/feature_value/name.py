from api.models import FeatureValueName
from api.repos.base import Repo


class FeatureValueNameRepo(Repo):
    def __init__(self):
        super().__init__(FeatureValueName)
