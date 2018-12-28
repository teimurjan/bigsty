from api.views.base import ValidatableView
from api.http.status_codes import OK_CODE
from api.errors import InvalidEntityFormat


class FeatureValueListView(ValidatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        feature_values = self._service.get_all()
        serialized_feature_values = [
            self._serializer_cls(feature_value).in_language(request.language).serialize() for feature_value in feature_values
        ]
        return {'data': serialized_feature_values}, OK_CODE

    def post(self, request):
        try:
            self._validate(request.data)
            feature_value = self._service.create(
                request.data, user=request.user)
            serialized_feature_value = self._serializer_cls(feature_value).in_language(
                request.language).with_serialized_feature_type().serialize()
            return {'data': serialized_feature_value}, OK_CODE
        except self._service.FeatureTypeInvalid:
            raise InvalidEntityFormat({'feature_type_id': 'errors.invalidID'})
        except self._service.LanguageInvalid:
            raise InvalidEntityFormat({'language_id': 'errors.invalidID'})
