from src.serializers.intl import IntlSerializer


class FeatureTypeSerializer(IntlSerializer):
    def __init__(self, feature_type):
        super().__init__()
        self._id = feature_type.id
        self._names = feature_type.names

    def serialize(self):
        return self._filter_with_only_fields({
            'id': self._id,
            'name': self._serialize_name(),
        })

    def _serialize_name(self):
        return self._get_intl_field_from(self._names)
