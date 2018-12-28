from api.dto.base import DTO


class FeatureValueDTO(DTO):
    def __init__(self, id_, names, feature_type):
        super().__init__(id_)
        self._names = names
        self._feature_type = feature_type

    @property
    def names(self):
        return self._names

    @property
    def feature_type(self):
        return self._feature_type

    @feature_type.setter
    def feature_type(self, feature_type):
        self._feature_type = feature_type
