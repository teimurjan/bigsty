from api.dto.feature_type import FeatureTypeDTO
from api.dto.product_type import ProductTypeDTO
from api.serializers.intl import IntlSerializer


class CategorySerializer(IntlSerializer):
    def __init__(self, category):
        super().__init__()
        self._id = category.id
        self._names = category.names
        self._feature_types = category.feature_types
        self._product_types = category.product_types

    def serialize(self):
        return self._filter_with_only_fields({
            'id': self._id,
            'name': self._serialize_name(),
            'feature_types': self._serialize_feature_types(),
            'product_types': self._serialize_product_types(),
        })

    def _serialize_name(self):
        return [name.value for name in self._names if name.language == self._language][0]

    def with_serialized_feature_types(self):
        from api.serializers.feature_type import FeatureTypeSerializer
        self._feature_types = [
            FeatureTypeSerializer(feature_type).serialize() for feature_type in self._feature_types
        ]
        return self

    def with_serialized_product_types(self):
        from api.serializers.product_type import ProductTypeSerializer
        self._product_types = [
            ProductTypeSerializer(product_type).serialize() for product_type in self._product_types
        ]
        return self

    def _serialize_feature_types(self):
        if len(self._feature_types) > 0 and isinstance(self._feature_types[0], FeatureTypeDTO):
            return [feature_type.id for feature_type in self._feature_types]
        else:
            return self._feature_types

    def _serialize_product_types(self):
        if len(self._product_types) > 0 and isinstance(self._product_types[0], ProductTypeDTO):
            return [product_type.id for product_type in self._product_types]
        else:
            return self._product_types
