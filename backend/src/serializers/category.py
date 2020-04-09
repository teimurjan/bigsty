from src.serializers.intl import IntlSerializer


class CategorySerializer(IntlSerializer):
    def __init__(self, category):
        super().__init__()
        self._id = category.id
        self._names = category.names
        self._parent_category_id = category.parent_category_id
        self._slug = category.slug

    def serialize(self):
        return self._filter_with_only_fields({
            'id': self._id,
            'name': self._serialize_name(),
            'parent_category_id': self._parent_category_id,
            'slug': self._slug
        })

    def _serialize_name(self):
        return self._get_intl_field_from(self._names)
