from api.dto.feature_type import FeatureTypeDTO
from api.serializers.intl import IntlSerializer


class FeatureValueSerializer(IntlSerializer):
    def __init__(self, feature_value):
        super().__init__()
        self._id = feature_value.id
        self._names = feature_value.names
        self._feature_type = feature_value.feature_type

    def serialize(self):
        return self._filter_with_only_fields({
            'id': self._id,
            'name': self._serialize_name(),
            'feature_type': self._serialize_feature_type(),
        })

    def _serialize_name(self):
        return self._get_intl_field_from(self._names)

    def with_serialized_feature_type(self):
        from api.serializers.feature_type import FeatureTypeSerializer
        self._feature_type = FeatureTypeSerializer(
            self._feature_type
        ).in_language(self._language).serialize()
        return self

    def _serialize_feature_type(self):
        if isinstance(self._feature_type, FeatureTypeDTO):
            return self._feature_type.id
        return self._feature_type
