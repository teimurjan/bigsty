from api.dto.base import DTO


class ProductTypeNameDTO(DTO):
    def __init__(self, id_, product_type, value, language):
        super().__init__(id_)
        self._product_type = product_type
        self._value = value
        self._language = language

    @property
    def product_type(self):
        return self._product_type

    @property
    def value(self):
        return self._value

    @property
    def language(self):
        return self._language
