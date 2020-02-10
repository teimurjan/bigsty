from src.models.product_type import ProductType
from src.models.feature_value import FeatureValue
from src.serializers.intl import IntlSerializer


class ProductSerializer(IntlSerializer):
    def __init__(self, product):
        super().__init__()
        self._id = product.id
        self._discount = product.discount
        self._price = product.price
        self._quantity = product.quantity
        self._product_type = product.product_type
        self._images = product.images
        self._feature_values = product.feature_values

    def serialize(self):
        return self._filter_with_only_fields({
            'id': self._id,
            'discount': self._discount,
            'price': self._price,
            'quantity': self._quantity,
            'product_type': self._serialize_product_type(),
            'images': self._serialize_images(),
            'feature_values': self._serialize_feature_values(),
        })

    def with_serialized_product_type(self):
        from src.serializers.product_type import ProductTypeSerializer
        if isinstance(self._product_type, ProductType):
            self._product_type = ProductTypeSerializer(
                self._product_type
            ).in_language(self._language).only(['id', 'name', 'category', 'feature_types']).serialize()
        return self

    def _serialize_product_type(self):
        if isinstance(self._product_type, ProductType):
            return self._product_type.id
        return self._product_type

    def _serialize_images(self):
        return [image.image for image in self._images]

    def with_serialized_feature_values(self):
        from src.serializers.feature_value import FeatureValueSerializer
        self._feature_values = [
            FeatureValueSerializer(fv).in_language(self._language).serialize()
            for fv in self._feature_values
        ]
        return self

    def _serialize_feature_values(self):
        if self._feature_values and isinstance(self._feature_values[0], FeatureValue):
            return [feature_value.id for feature_value in self._feature_values]
        return self._feature_values
