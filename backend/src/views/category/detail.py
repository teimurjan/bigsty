from src.views.base import ValidatableView
from src.errors import InvalidEntityFormat
from src.constants.status_codes import NOT_FOUND_CODE, OK_CODE


class CategoryDetailView(ValidatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request, category_id):
        try:
            category = self._service.get_one(category_id)
            serialized_category = (
                self
                ._serializer_cls(category)
                .in_language(request.language)
                .with_serialized_feature_types()
                .serialize()
            )
            return {'data': serialized_category}, OK_CODE
        except self._service.CategoryNotFound:
            return {}, NOT_FOUND_CODE

    def put(self, request, category_id):
        try:
            data = request.get_json()
            self._validate(data)
            category = \
                self._service.update(category_id, data, user=request.user)
            serialized_category = (
                self
                ._serializer_cls(category)
                .in_language(request.language)
                .with_serialized_feature_types()
                .serialize()
            )
            return {'data': serialized_category}, OK_CODE
        except self._service.CategoryNotFound:
            return {}, NOT_FOUND_CODE
        except self._service.FeatureTypeInvalid:
            raise InvalidEntityFormat({'feature_types': 'errors.invalidID'})

    def delete(self, request, category_id):
        try:
            self._service.delete(category_id)
            return {}, OK_CODE
        except self._service.CategoryNotFound:
            return {}, NOT_FOUND_CODE
