from api.models import FeatureValue
from api.repos.base import Repo


class FeatureValueRepo(Repo):
    def __init__(self):
        super().__init__(FeatureValue)

    def create(self, feature_type):
        return super()._create(feature_type_id=feature_type.id)

    def update(self, feature_value, feature_type):
        self._update(feature_value.id, feature_type_id=feature_type.id)
        feature_value.feature_type = feature_type
