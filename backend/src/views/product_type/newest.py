from src.errors import InvalidEntityFormat
from src.constants.status_codes import OK_CODE
from src.views.base import PaginatableView
from src.services.product_type import ProductTypeService
from src.serializers.product_type import ProductTypeSerializer
from src.utils.number import parse_int


class ProductTypeNewestView:
    def __init__(self, service: ProductTypeService, serializer_cls: ProductTypeSerializer):
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        product_types = self._service.get_newest(8)

        serialized_product_types = [
            self
            ._serializer_cls(product_type)
            .add_products(product_type.products)
            .in_language(request.language)
            .serialize()
            for product_type in product_types
        ]

        return {'data': serialized_product_types}, OK_CODE
