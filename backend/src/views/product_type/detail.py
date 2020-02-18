from src.views.base import ValidatableView
from src.errors import InvalidEntityFormat
from src.constants.status_codes import NOT_FOUND_CODE, OK_CODE, UNPROCESSABLE_ENTITY_CODE
from src.utils.json import parse_json_from_form_data
from src.services.product_type import ProductTypeService


class ProductTypeDetailView(ValidatableView):
    def __init__(self, validator, service: ProductTypeService, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request, product_type_id):
        try:
            product_type = self._service.get_one(product_type_id)

            should_get_raw_intl_field = request.args.get('raw_intl') == '1'

            serialized_product_type = (
                self
                ._serializer_cls(product_type)
                .in_language(None if should_get_raw_intl_field else request.language)
                .serialize()
            )
            return {'data': serialized_product_type}, OK_CODE
        except self._service.ProductTypeNotFound:
            return {}, NOT_FOUND_CODE

    def put(self, request, product_type_id):
        try:
            data = {
                **parse_json_from_form_data(request.form),
                'image': request.files.get('image'),
            }
            self._validate(data)

            should_get_raw_intl_field = request.args.get('raw_intl') == '1'

            product_type = self._service.update(
                product_type_id,
                data,
                user=request.user
            )
            serialized_product_type = (
                self
                ._serializer_cls(product_type)
                .in_language(None if should_get_raw_intl_field else request.language)
                .with_serialized_feature_types()
                .serialize()
            )
            return {'data': serialized_product_type}, OK_CODE
        except self._service.ProductTypeNotFound:
            return {}, NOT_FOUND_CODE
        except self._service.CategoryInvalid:
            raise InvalidEntityFormat({'category_id': 'errors.invalidID'})
        except self._service.FeatureTypesInvalid:
            raise InvalidEntityFormat({'feature_types': 'errors.invalidID'})

    def delete(self, request, product_type_id):
        try:
            self._service.delete(product_type_id)
            return {}, OK_CODE
        except self._service.ProductTypeNotFound:
            return {}, NOT_FOUND_CODE
        except self._service.ProductTypeWithProductsIsUntouchable:
            raise InvalidEntityFormat({'products': 'errors.hasProducts'})

    def head(self, request, product_type_id):
        try:
            self._service.get_one(product_type_id)
            return {}, OK_CODE
        except self._service.ProductTypeNotFound:
            return {}, NOT_FOUND_CODE
