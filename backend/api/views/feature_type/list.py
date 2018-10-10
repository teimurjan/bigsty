from api.views.base import ValidatableView
from api.utils.http import OK_CODE


class FeatureTypeListView(ValidatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        feature_types = self._service.get_all()
        serialized_feature_types = [
            self._serializer_cls(feature_type).serialize() for feature_type in feature_types
        ]
        return {'data': serialized_feature_types}, OK_CODE

    def post(self, request):
        self._validate(request.data)
        feature_type = self._service.create(request.data)
        serialized_feature_type = self._serializer_cls(feature_type).serialize()
        return {'data': serialized_feature_type}, OK_CODE
