from src.views.base import ValidatableView, PaginatableView
from src.constants.status_codes import OK_CODE
from utils.json import parse_json_from_form_data
from src.errors import InvalidEntityFormat


class ProductListView(ValidatableView, PaginatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        products = self._service.get_all()
        
        meta = None
        page = request.GET.get('page')
        if page:
            limit = request.GET.get('limit', 20)
            products, meta = self._paginate(products, page, limit)

        serialized_products = [
            self._serializer_cls(product).in_language(request.language).serialize() for product in products
        ]
        return {'data': serialized_products, 'meta': meta}, OK_CODE

    def post(self, request):
        try:
            data = {
                **parse_json_from_form_data(request.form_data),
                'images': request.files.getlist('images')
            }
            self._validate(data)
            product = self._service.create(data, user=request.user)
            serialized_product = self._serializer_cls(
                product
            ).in_language(request.language).serialize()
            return {'data': serialized_product}, OK_CODE
        except self._service.ProductImageInvalid:
            raise InvalidEntityFormat({'images': 'errors.invalidImage'})
        except self._service.FeatureValuesInvalid:
            raise InvalidEntityFormat({'feature_values': 'errors.invalidID'})
        except self._service.ProductTypeInvalid:
            raise InvalidEntityFormat({'product_type': 'errors.invalidID'})
