from api.dto.base import DTO


class ProductImageDTO(DTO):
    def __init__(self, id_, image, product):
        super().__init__(id_)
        self._image = image
        self._product = product

    @property
    def image(self):
        return self._image

    @property
    def product(self):
        return self._product
