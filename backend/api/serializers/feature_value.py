from api.dto.feature_type import FeatureTypeDTO
from api.dto.product_type import ProductTypeDTO
from api.dto.product import ProductDTO
from api.serializers.intl import IntlSerializer


class FeatureValueSerializer(IntlSerializer):
    def __init__(self, feature_value):
        super().__init__()
        self._id = feature_value.id
        self._names = feature_value.names
        self._feature_type = feature_value.feature_type
        self._product_types = feature_value.product_types
        self._products = feature_value.products

    def serialize(self):
        return self._filter_with_only_fields({
            'id': self._id,
            'name': self._serialize_name(),
            'feature_types': self._serialize_feature_types(),
            'product_types': self._serialize_product_types(),
            'products': self._serialize_products()
        })

    def _serialize_name(self):
        return [name.name for name in self._names if name.language == self._language][0]

    def with_serialized_feature_types(self):
        from api.serializers.feature_type import FeatureTypeSerializer
        self._feature_types = [
            FeatureTypeSerializer(feature_type).serialize() for feature_type in self._feature_types
        ]
        return self

    def _serialize_feature_types(self):
        if len(self._feature_types) > 0 and isinstance(self._feature_types[0], FeatureTypeDTO):
            return [feature_type.id for feature_type in self._feature_types]
        else:
            return self._feature_types

    def with_serialized_product_types(self):
        from api.serializers.product_type import ProductTypeSerializer
        self._product_types = [
            ProductTypeSerializer(product_type).serialize() for product_type in self._product_types
        ]
        return self

    def _serialize_product_types(self):
        if len(self._product_types) > 0 and isinstance(self._product_types[0], ProductTypeDTO):
            return [product_type.id for product_type in self._product_types]
        else:
            return self._product_types

    def with_serialized_products(self):
        from api.serializers.product import ProductSerializer
        self._products = [
            ProductSerializer(product).serialize() for product in self._products
        ]
        return self

    def _serialize_products(self):
        if len(self._products) > 0 and isinstance(self._products[0], ProductDTO):
            return [product.id for product in self._products]
        else:
            return self._products
