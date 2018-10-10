from api.views.base import ValidatableView
from api.utils.http import OK_CODE


class ProductTypeListView(ValidatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        product_types = self._service.get_all()
        serialized_product_types = [
            self._serializer_cls(product_type).serialize() for product_type in product_types
        ]
        return {'data': serialized_product_types}, OK_CODE

    def post(self, request):
        self._validate(request.data)
        product_type = self._service.create(request.data)
        serialized_product_type = self._serializer_cls(
            product_type
        ).serialize()
        return {'data': serialized_product_type}, OK_CODE
