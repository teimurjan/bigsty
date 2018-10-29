from api.views.base import ValidatableView
from api.http.status_codes import OK_CODE
from api.errors import InvalidEntityFormat
from api.utils.json import parse_json_from_form_data

class ProductTypeListView(ValidatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        product_types = self._service.get_all()
        serialized_product_types = [
            self._serializer_cls(product_type).in_language(request.language).serialize() for product_type in product_types
        ]
        return {'data': serialized_product_types}, OK_CODE

    def post(self, request):
        try:
            data = {
                **parse_json_from_form_data(request.form_data),
                **{k: file_ for k, file_ in request.files.items()}
            }
            self._validate(data)
            product_type = self._service.create(data)
            serialized_product_type = self._serializer_cls(
                product_type
            ).in_language(request.language).serialize()
            return {'data': serialized_product_type}, OK_CODE
        except self._service.CategoryInvalid:
            raise InvalidEntityFormat({'category_id': 'errors.invalidID'})
        except self._service.ProductImageInvalid:
            raise InvalidEntityFormat({'image': 'errors.invalidImage'})
        except self._service.FeatureValuesInvalid:
            raise InvalidEntityFormat({'feature_values': 'errors.invalidID'})
        except self._service.FeatureValuesOfInvalidType:
            raise InvalidEntityFormat({'feature_values': 'errors.invalidType'})
        except self._service.LanguageInvalid:
            raise InvalidEntityFormat({'language_id': 'errors.invalidID'})
