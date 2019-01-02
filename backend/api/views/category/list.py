from api.views.base import ValidatableView
from api.errors import InvalidEntityFormat
from api.http.status_codes import OK_CODE


class CategoryListView(ValidatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        categories = self._service.get_all()
        serialized_categories = [
            self._serializer_cls(category).in_language(request.language).serialize() for category in categories
        ]
        return {'data': serialized_categories}, OK_CODE

    def post(self, request):
        try:
            self._validate(request.data)
            category = self._service.create(request.data, user=request.user)
            serialized_category = self._serializer_cls(category).in_language(
                request.language).with_serialized_feature_types().serialize()
            return {'data': serialized_category}, OK_CODE
        except self._service.LanguageInvalid:
            raise InvalidEntityFormat({'language_id': 'errors.invalidID'})
        except self._service.FeatureTypeInvalid:
            raise InvalidEntityFormat({'feature_types': 'errors.invalidID'})
