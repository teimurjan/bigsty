from api.dto.feature_type import FeatureTypeDTO
from api.dto.product_type import ProductTypeDTO
from api.serializers.intl import IntlSerializer


class CategorySerializer(IntlSerializer):
    def __init__(self, category):
        super().__init__()
        self._id = category.id
        self._names = category.names

    def serialize(self):
        return self._filter_with_only_fields({
            'id': self._id,
            'name': self._serialize_name(),
        })

    def _serialize_name(self):
        names = [
            name.value for name in self._names if name.language.name == self._language.name
        ]
        return "" if len(names) == 0 else names[0]
