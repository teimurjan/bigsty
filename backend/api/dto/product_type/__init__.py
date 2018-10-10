from api.dto.base import DTO


class ProductTypeDTO(DTO):
    def __init__(self, id_, names, descriptions, short_descriptions,
                 image, category, feature_values, products):
        super().__init__(id)
        self._names = names
        self._descriptions = descriptions
        self._short_descriptions = short_descriptions
        self._image = image
        self._category = category
        self._feature_values = feature_values
        self._products = products

    @property
    def names(self):
        return self._names

    @property
    def descriptions(self):
        return self._descriptions

    @property
    def short_descriptions(self):
        return self._short_descriptions

    @property
    def image(self):
        return self._image

    @property
    def category(self):
        return self._category

    @property
    def feature_values(self):
        return self._feature_values

    @property
    def products(self):
        return self._products
