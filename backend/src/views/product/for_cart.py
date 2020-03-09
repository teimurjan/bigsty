from src.constants.status_codes import OK_CODE
from src.errors import InvalidEntityFormat
from src.serializers.product import ProductSerializer
from src.services.product import ProductService
from src.utils.json import parse_json_from_form_data
from src.utils.number import parse_int


class ProductForCartView:
    def __init__(self, service: ProductService, serializer_cls: ProductSerializer):
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        ids = request.args.getlist('ids', type=int)
        products = self._service.get_by_ids(ids)

        serialized_products = [
            self
            ._serializer_cls(product)
            .in_language(request.language)
            .with_serialized_product_type()
            .with_serialized_feature_values()
            .serialize()
            for product in products
        ]
        return {'data': serialized_products}, OK_CODE
