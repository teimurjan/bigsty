from api.dto.base import DTO


class CategoryDTO(DTO):
    def __init__(self, id_, names, feature_types):
        super().__init__(id_)
        self._names = names
        self._feature_types = feature_types

    @property
    def names(self):
        return self._names

    @property
    def feature_types(self):
        return self._feature_types

    @feature_types.setter
    def feature_types(self, feature_types):
        self._feature_types = feature_types