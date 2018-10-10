from api.views.base import ValidatableView
from api.utils.http import OK_CODE


class ProductListView(ValidatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        products = self._service.get_all()
        serialized_products = [
            self._serializer_cls(product).serialize() for product in products
        ]
        return {'data': serialized_products}, OK_CODE

    def post(self, request):
        self._validate(request.data)
        product = self._service.create(request.data)
        serialized_product = self._serializer_cls(
            product
        ).serialize()
        return {'data': serialized_product}, OK_CODE
