from api.views.base import ValidatableView
from api.errors import InvalidEntityFormat
from api.http.status_codes import NOT_FOUND_CODE, OK_CODE


class CategoryDetailView(ValidatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request, category_id):
        try:
            category = self._service.get_one(category_id)
            serialized_category = self._serializer_cls(category).in_language(
                request.language).with_serialized_feature_types().serialize()
            return {'data': serialized_category}, OK_CODE
        except self._service.CategoryNotFound:
            return {}, NOT_FOUND_CODE

    def put(self, request, category_id):
        try:
            self._validate(request.data)
            category = self._service.update(
                category_id, request.data, user=request.user)
            serialized_category = self._serializer_cls(category).in_language(
                request.language).with_serialized_feature_types().serialize()
            return {'data': serialized_category}, OK_CODE
        except self._service.LanguageInvalid:
            raise InvalidEntityFormat({'language_id': 'errors.invalidID'})
        except self._service.CategoryNotFound:
            return {}, NOT_FOUND_CODE

    def delete(self, request, category_id):
        try:
            self._service.delete(category_id)
            return {}, OK_CODE
        except self._service.CategoryNotFound:
            return {}, NOT_FOUND_CODE
