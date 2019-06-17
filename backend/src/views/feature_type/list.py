from src.views.base import ValidatableView, PaginatableView
from src.constants.status_codes import OK_CODE
from src.errors import InvalidEntityFormat
from src.utils.number import parse_int


class FeatureTypeListView(ValidatableView, PaginatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        feature_types = self._service.get_all()

        meta = None
        page = parse_int(request.args.get('page'))
        if page:
            limit = parse_int(request.args.get('limit', 20))
            feature_types, meta = self._paginate(feature_types, page, limit)

        serialized_feature_types = [
            self
            ._serializer_cls(feature_type)
            .in_language(request.language)
            .serialize()
            for feature_type in feature_types
        ]
        return {'data': serialized_feature_types, 'meta': meta}, OK_CODE

    def post(self, request):
        try:
            data = request.get_json()
            self._validate(data)
            feature_type = self._service.create(data, user=request.user)
            serialized_feature_type = (
                self
                ._serializer_cls(feature_type)
                .in_language(request.language)
                .serialize()
            )
            return {'data': serialized_feature_type}, OK_CODE
        except self._service.LanguageInvalid:
            raise InvalidEntityFormat({'language_id': 'errors.invalidID'})
