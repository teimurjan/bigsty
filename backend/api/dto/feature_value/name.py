from api.dto.base import DTO

class FeatureValueNameDTO(DTO):
    def __init__(self, id_, feature_value, value, language):
        super().__init__(id_)
        self._feature_value = feature_value
        self._value = value
        self._language = language

    @property
    def feature_value(self):
        return self._feature_value

    @property
    def value(self):
        return self._value

    @property
    def language(self):
        return self._language