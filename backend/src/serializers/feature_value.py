from src.models.feature_type import FeatureType
from src.serializers.intl import IntlSerializer
from src.serializers.feature_type import FeatureTypeSerializer


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
        self._with_serialized_relation('_feature_type', FeatureType, FeatureTypeSerializer,
                                       lambda serializer: serializer.in_language(self._language))
        return self

    def _serialize_feature_type(self):
        return self._serialize_relation('_feature_type', FeatureType)
