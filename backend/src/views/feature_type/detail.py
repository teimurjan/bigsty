from src.views.base import ValidatableView
from src.errors import InvalidEntityFormat
from src.constants.status_codes import NOT_FOUND_CODE, OK_CODE


class FeatureTypeDetailView(ValidatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request, feature_type_id):
        try:
            feature_type = self._service.get_one(feature_type_id)
            serialized_feature_type = self._serializer_cls(
                feature_type).in_language(request.language).serialize()
            return {'data': serialized_feature_type}, OK_CODE
        except self._service.FeatureTypeNotFound:
            return {}, NOT_FOUND_CODE

    def put(self, request, feature_type_id):
        try:
            self._validate(request.data)
            feature_type = self._service.update(
                feature_type_id, request.data, user=request.user)
            serialized_feature_type = self._serializer_cls(
                feature_type).in_language(request.language).serialize()
            return {'data': serialized_feature_type}, OK_CODE
        except self._service.LanguageInvalid:
            raise InvalidEntityFormat({'language_id': 'errors.invalidID'})
        except self._service.FeatureTypeNotFound:
            return {}, NOT_FOUND_CODE

    def delete(self, request, feature_type_id):
        try:
            self._service.delete(feature_type_id)
            return {}, OK_CODE
        except self._service.FeatureTypeNotFound:
            return {}, NOT_FOUND_CODE
