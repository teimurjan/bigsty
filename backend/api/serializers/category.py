from api.serializers.intl import IntlSerializer
from api.serializers.feature_type import FeatureTypeSerializer
from api.dto.feature_type import FeatureTypeDTO


class CategorySerializer(IntlSerializer):
    def __init__(self, category):
        super().__init__()
        self._id = category.id
        self._names = category.names
        self._feature_types = category.feature_types

    def serialize(self):
        return self._filter_with_only_fields({
            'id': self._id,
            'name': self._serialize_name(),
            'feature_types': self._serialize_feature_types(),
        })

    def _serialize_name(self):
        return self._get_intl_field_from(self._names)

    def _serialize_feature_types(self):
        if len(self._feature_types) > 0 and isinstance(self._feature_types[0], FeatureTypeDTO):
            return [feature_type.id for feature_type in self._feature_types]
        return self._feature_types

    def with_serialized_feature_types(self):
        self._feature_types = [
            FeatureTypeSerializer(feature_type).in_language(
                self._language
            ).serialize()
            for feature_type in self._feature_types
        ]
        return self
