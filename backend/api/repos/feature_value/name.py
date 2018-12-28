from api.models import FeatureValueName
from api.repos.base import Repo


class FeatureValueNameRepo(Repo):
    def __init__(self):
        super().__init__(FeatureValueName)

    def create(self, language_id, value, feature_value):
        name = super()._create(
            language_id=language_id,
            value=value,
            feature_value_id=feature_value.id
        )
        feature_value.names.append(name)
    

    def update(self, name, value):
        self.model_cls.objects.filter(
            language_id=name.language.id,
            feature_value_id=name.feature_value.id
        ).update(value=value)
        name.value = value