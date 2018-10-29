from api.views.base import ValidatableView
from api.http.status_codes import OK_CODE
from api.utils.json import parse_json_from_form_data
from api.errors import InvalidEntityFormat

class ProductListView(ValidatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        products = self._service.get_all()
        serialized_products = [
            self._serializer_cls(product).in_language(request.language).serialize() for product in products
        ]
        return {'data': serialized_products}, OK_CODE

    def post(self, request):
        try:
            data = {
                **parse_json_from_form_data(request.form_data),
                'images': request.files.getlist('images')
            }
            self._validate(data)
            product = self._service.create(data)
            serialized_product = self._serializer_cls(
                product
            ).in_language(request.language).serialize()
            return {'data': serialized_product}, OK_CODE
        except self._service.ProductImageInvalid:
            raise InvalidEntityFormat({'images': 'errors.invalidImage'})
        except self._service.FeatureValuesInvalid:
            raise InvalidEntityFormat({'feature_values': 'errors.invalidID'})
        except self._service.FeatureValuesOfTheSameType:
            raise InvalidEntityFormat({'feature_values': 'errors.sameFeatureType'})
        except self._service.ProductTypeInvalid:
            raise InvalidEntityFormat({'product_type': 'errors.invalidID'})