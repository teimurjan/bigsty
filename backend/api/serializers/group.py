from api.serializers.base import Serializer


class GroupSerializer(Serializer):
    def __init__(self, group):
        super().__init__()
        self._id = group.id
        self._name = group.name

    def serialize(self):
        return self._filter_with_only_fields({
            'name': self._name,
            'id': self._id
        })
