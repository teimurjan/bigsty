from api.views.base import ValidatableView
from api.utils.http import OK_CODE


class FeatureValueListView(ValidatableView):
    def __init__(self, validator, service, serializer_cls):
        super().__init__(validator)
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request):
        feature_values = self._service.get_all()
        serialized_feature_values = [
            self._serializer_cls(feature_value).serialize() for feature_value in feature_values
        ]
        return {'data': serialized_feature_values}, OK_CODE

    def post(self, request):
        self._validate(request.data)
        feature_value = self._service.create(request.data)
        serialized_feature_value = self._serializer_cls(
            feature_value).serialize()
        return {'data': serialized_feature_value}, OK_CODE
