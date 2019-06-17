from src.views.base import ValidatableView
from src.errors import InvalidEntityFormat
from src.constants.status_codes import OK_CODE


class CategoryListView(ValidatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        categories = self._service.get_all()
        serialized_categories = [
            self
            ._serializer_cls(category)
            .in_language(request.language)
            .serialize()
            for category in categories
        ]
        return {'data': serialized_categories}, OK_CODE

    def post(self, request):
        try:
            data = request.get_json()
            self._validate(data)
            category = self._service.create(data, user=request.user)
            serialized_category = (
                self
                ._serializer_cls(category)
                .in_language(request.language)
                .with_serialized_feature_types()
                .serialize()
            )
            return {'data': serialized_category}, OK_CODE
        except self._service.FeatureTypeInvalid:
            raise InvalidEntityFormat({'feature_types': 'errors.invalidID'})
