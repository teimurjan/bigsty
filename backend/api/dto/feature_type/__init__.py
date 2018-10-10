from api.dto.base import DTO


class FeatureTypeDTO(DTO):
    def __init__(self, id_, names, categories, feature_values):
        super().__init__(id_)
        self._names = names
        self._feature_values = feature_values
        self._categories = categories

    @property
    def names(self):
        return self._names

    @property
    def categories(self):
        return self._categories

    @property
    def feature_values(self):
        return self._feature_values
