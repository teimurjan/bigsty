from api.dto.base import DTO


class FeatureTypeNameDTO(DTO):
    def __init__(self, id_, feature_type, value, language):
        super().__init__(id_)
        self._feature_type = feature_type
        self._value = value
        self._language = language

    @property
    def feature_type(self):
        return self._feature_type

    @property
    def value(self):
        return self._value

    @property
    def language(self):
        return self._language
