from src.models import User
from src.serializers.feature_value import FeatureValueSerializer
from src.serializers.intl import IntlSerializer
from src.serializers.product import ProductSerializer


class OrderSerializer(IntlSerializer):
    def __init__(self, order):
        super().__init__()
        self._id = order.id
        self._user = order.user
        self._user_name = order.user_name
        self._user_phone_number = order.user_phone_number
        self._user_address = order.user_address
        self._status = order.status
        self._items = order.items
        self._created_on = order.created_on

    def serialize(self):
        return self._filter_with_only_fields({
            'id': self._id,
            'items': self._serialize_items(),
            'user': self._serialize_user(),
            'user_name': self._user_name,
            'user_phone_number': self._user_phone_number,
            'user_address': self._user_address,
            'status': self._status,
            'created_on': self._created_on,
        })

    def with_serialized_user(self):
        from src.serializers.user import UserSerializer
        self._with_serialized_relation('_user', User, UserSerializer)
        return self

    def _serialize_user(self):
        return self._serialize_relation('_user', User)

    def _serialize_items(self):
        items = []
        for item in self._items:
            items.append({
                'id': item.id,
                'product_price_per_item': item.product_price_per_item,
                'product_discount': item.product_discount,
                'product_upc': item.product_upc,
                'product': ProductSerializer(item.product).in_language(self._language).with_serialized_product_type().only(['id', 'product_type']).serialize() if item.product else None,
                'quantity': item.quantity,
            })

        return items
