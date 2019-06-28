from src.errors import InvalidEntityFormat
from src.constants.status_codes import OK_CODE
from src.views.base import PaginatableView
from src.services.product_type import ProductTypeService
from src.serializers.product_type import ProductTypeSerializer
from src.utils.number import parse_int


class ProductTypeByCategoryView(PaginatableView):
    def __init__(self, service: ProductTypeService, serializer_cls: ProductTypeSerializer):
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request, category_id):
        product_types = self._service.get_by_category_id(category_id)

        meta = None
        page = parse_int(request.args.get('page'))
        if page:
            limit = parse_int(request.args.get('limit', 20))
            product_types, meta = self._paginate(product_types, page, limit)

        serialized_product_types = [
            self
            ._serializer_cls(product_type)
            .in_language(request.language)
            .serialize()
            for product_type in product_types
        ]

        return {'data': serialized_product_types, 'meta': meta}, OK_CODE
