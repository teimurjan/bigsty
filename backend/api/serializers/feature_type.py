from api.dto.category import CategoryDTO
from api.dto.feature_value import FeatureValueDTO
from api.serializers.intl import IntlSerializer


class FeatureTypeSerializer(IntlSerializer):
    def __init__(self, feature_type):
        super().__init__()
        self._id = feature_type.id
        self._names = feature_type.names
        self._feature_values = feature_type.feature_values
        self._categories = feature_type.categories

    def serialize(self):
        return self._filter_with_only_fields({
            'id': self._id,
            'name': self._serialize_name(),
            'feature_values': self._serialize_feature_values(),
            'categories': self._serialize_categories(),
        })

    def _serialize_name(self):
        return [name.value for name in self._names if name.language == self._language][0]

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

    def with_serialized_categories(self):
        from api.serializers.category import CategorySerializer
        self._product_types = [
            CategorySerializer(product_type).serialize() for product_type in self._product_types
        ]
        return self

    def _serialize_categories(self):
        if len(self._categories) > 0 and isinstance(self._categories[0], CategoryDTO):
            return [category.id for category in self._categories]
        else:
            return self._product_types
