from api.dto.product_type import ProductTypeDTO
from api.dto.feature_value import FeatureValueDTO
from api.serializers.base import Serializer

class ProductSerializer(Serializer):
    def __init__(self, product):
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
        from api.serializers.product_type import ProductTypeSerializer
        if isinstance(self._product_type, ProductTypeDTO):
            self._product_type = ProductTypeSerializer(
                self._product_type
            ).serialize()
        return self

    def _serialize_product_type(self):
        return self._product_type.id if isinstance(self._product_type, ProductTypeDTO) else self._product_type

    def _serialize_images(self):
        images = []
        for image in self._images:
            try:
                images.append(image.url)
            except (AttributeError, ValueError):
                pass
        return images

    def with_serialized_feature_values(self):
        from api.serializers.feature_value import FeatureValueSerializer
        self._feature_types = [
            FeatureValueSerializer(feature_type).serialize() for feature_type in self._feature_types
        ]
        return self

    def _serialize_feature_values(self):
        if len(self._feature_values) > 0 and isinstance(self._feature_values[0], FeatureValueDTO):
            return [feature_value.id for feature_value in self._feature_values]
        else:
            return self._feature_types
