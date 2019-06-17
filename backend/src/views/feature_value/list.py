from src.views.base import ValidatableView, PaginatableView
from src.constants.status_codes import OK_CODE
from src.errors import InvalidEntityFormat
from src.utils.number import parse_int


class FeatureValueListView(ValidatableView, PaginatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        feature_values = self._service.get_all()

        meta = None
        page = parse_int(request.args.get('page'))
        if page:
            limit = parse_int(request.args.get('limit', 20))
            feature_values, meta = self._paginate(feature_values, page, limit)

        serialized_feature_values = [
            self
            ._serializer_cls(feature_value)
            .in_language(request.language)
            .serialize()
            for feature_value in feature_values
        ]
        return {'data': serialized_feature_values, 'meta': meta}, OK_CODE

    def post(self, request):
        try:
            data = request.get_json()
            self._validate(data)
            feature_value = self._service.create(data, user=request.user)
            serialized_feature_value = (
                self.
                _serializer_cls(feature_value)
                .in_language(request.language)
                .with_serialized_feature_type()
                .serialize()
            )
            return {'data': serialized_feature_value}, OK_CODE
        except self._service.FeatureTypeInvalid:
            raise InvalidEntityFormat({'feature_type_id': 'errors.invalidID'})
        except self._service.LanguageInvalid:
            raise InvalidEntityFormat({'language_id': 'errors.invalidID'})
