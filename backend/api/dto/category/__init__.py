from api.dto.base import DTO


class CategoryDTO(DTO):
    def __init__(self, id_, names, feature_types, product_types):
        super().__init__(id_)
        self._names = names
        self._feature_types = feature_types
        self._product_types = product_types

    @property
    def names(self):
        return self._names

    @property
    def feature_types(self):
        return self._feature_types

    @property
    def product_types(self):
        return self._product_types
