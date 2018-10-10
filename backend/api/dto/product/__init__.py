from api.dto.base import DTO


class ProductDTO(DTO):
    def __init__(self, id_, discount, price, quantity, product_type, images, feature_values):
        super().__init__(id_)
        self._discount = discount
        self._price = price
        self._quantity = quantity
        self._product_type = product_type
        self._images = images
        self._feature_values = feature_values

    @property
    def discount(self):
        return self._discount

    @property
    def price(self):
        return self._price

    @property
    def quantity(self):
        return self._quantity

    @property
    def product_type(self):
        return self._product_type

    @property
    def images(self):
        return self._images

    @property
    def feature_values(self):
        return self._feature_values
