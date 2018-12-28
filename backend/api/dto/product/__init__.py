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

    @discount.setter
    def discount(self, discount):
        self._discount = discount

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, price):
        self._price = price

    @property
    def quantity(self):
        return self._quantity

    @quantity.setter
    def quantity(self, quantity):
        self._quantity = quantity

    @property
    def product_type(self):
        return self._product_type

    @product_type.setter
    def product_type(self, product_type):
        self._product_type = product_type

    @property
    def images(self):
        return self._images

    @images.setter
    def images(self, images):
        self._images = images

    @property
    def feature_values(self):
        return self._feature_values

    @feature_values.setter
    def feature_values(self, feature_values):
        self._feature_values = feature_values
