from api.dto.base import DTO


class CategoryNameDTO(DTO):
    def __init__(self, id_, category, value, language):
        super().__init__(id_)
        self._category = category
        self._value = value
        self._language = language

    @property
    def category(self):
        return self._category

    @property
    def value(self):
        return self._value

    @value.setter
    def value(self, value):
        self._value = value

    @property
    def language(self):
        return self._language
