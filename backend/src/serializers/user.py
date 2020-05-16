from src.models.group import Group
from src.serializers.base import Serializer
from src.serializers.group import GroupSerializer


class UserSerializer(Serializer):
    def __init__(self, user):
        super().__init__()
        self._id = user.id
        self._email = user.email
        self._name = user.name
        self._group = user.group

    def serialize(self):
        return self._filter_fields({
            'id': self._id,
            'email': self._email,
            'name': self._name,
            'group': self._serialize_group(),
        })

    def with_serialized_group(self):
        self._with_serialized_relation('_group', Group, GroupSerializer)
        return self

    def _serialize_group(self):
        return self._group.id if isinstance(self._group, Group) else self._group,
