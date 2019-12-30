from src.views.base import ValidatableView, PaginatableView
from src.constants.status_codes import OK_CODE
from src.errors import InvalidEntityFormat
from src.utils.json import parse_json_from_form_data
from src.utils.number import parse_int
from src.services.product_type import ProductTypeService


class ProductTypeListView(ValidatableView, PaginatableView):
    def __init__(
        self,
        validator,
        service: ProductTypeService,
        serializer_cls
    ):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        product_types = self._service.get_all()

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

    def post(self, request):
        try:
            data = {
                **parse_json_from_form_data(request.form),
                'image': request.files.get('image'),
            }
            self._validate(data)
            product_type = self._service.create(data, user=request.user)
            serialized_product_type = (
                self
                ._serializer_cls(product_type)
                .in_language(request.language)
                .with_serialized_feature_types()
                .serialize()
            )
            return {'data': serialized_product_type}, OK_CODE
        except self._service.CategoryInvalid:
            raise InvalidEntityFormat({'category_id': 'errors.invalidID'})
        except self._service.FeatureTypesInvalid:
            raise InvalidEntityFormat({'feature_types': 'errors.invalidID'})
