from src.models.group import Group
from src.serializers.base import Serializer
from src.serializers.group import GroupSerializer


class UserSerializer(Serializer):
    def __init__(self, user):
        super().__init__()
        self._id = user.pk
        self._email = user.email
        self._name = user.name
        self._date_joined = user.date_joined
        self._group = user.group
        self._is_active = user.is_active

    def serialize(self):
        return self._filter_with_only_fields({
            'id': self._id,
            'email': self._email,
            'name': self._name,
            'date_joined': self._date_joined,
            'group': self._serialize_group(),
            'is_active': self._is_active,
        })

    def with_serialized_group(self):
        self._with_serialized_relation('_group', Group, GroupSerializer)
        return self

    def _serialize_group(self):
        return self._group.pk if isinstance(self._group, Group) else self._group,
