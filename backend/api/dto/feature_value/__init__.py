from api.dto.base import DTO


class FeatureValueDTO(DTO):
    def __init__(self, id_, names, product_types, feature_type, products):
        super().__init__(id_)
        self._names = names
        self._feature_type = feature_type
        self._product_types = product_types
        self._products = products

    @property
    def names(self):
        return self._names

    @property
    def feature_type(self):
        return self._feature_type

    @property
    def product_types(self):
        return self._product_types

    @property
    def products(self):
        return self._products
