from api.models import FeatureTypeName
from api.repos.base import Repo


class FeatureTypeNameRepo(Repo):
    def __init__(self):
        super().__init__(FeatureTypeName)

    def create(self, language_id, value, feature_type):
        name = super()._create(
            language_id=language_id,
            value=value,
            feature_type_id=feature_type.id
        )
        feature_type.names.append(name)

    def update(self, name, value):
        self.model_cls.objects.filter(
            language_id=name.language.id,
            feature_type_id=name.feature_type.id
        ).update(value=value)
        name.value = value