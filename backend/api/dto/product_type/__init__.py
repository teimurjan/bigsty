from api.dto.base import DTO


class ProductTypeDTO(DTO):
    def __init__(self, id_, names, descriptions, short_descriptions,
                 image, category, feature_values):
        super().__init__(id_)
        self._names = names
        self._descriptions = descriptions
        self._short_descriptions = short_descriptions
        self._image = image
        self._category = category
        self._feature_values = feature_values

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

    @names.setter
    def names(self, names):
        self._names = names

    @descriptions.setter
    def descriptions(self, descriptions):
        self._descriptions = descriptions

    @short_descriptions.setter
    def short_descriptions(self, short_descriptions):
        self._short_descriptions = short_descriptions

    @image.setter
    def image(self, image):
        self._image = image

    @category.setter
    def category(self, category):
        self._category = category

    @feature_values.setter
    def feature_values(self, feature_values):
        self._feature_values = feature_values
