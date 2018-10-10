from api.dto.base import DTO


class ProductImageDTO(DTO):
    def __init__(self, id_, file, product):
        super().__init__(id_)
        self._file = file
        self._product = product

    @property
    def file(self):
        return self._file

    @property
    def product(self):
        return self._product
