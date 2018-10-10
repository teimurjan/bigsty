from api.views.base import ValidatableView
from api.utils.http import OK_CODE


class CategoryListView(ValidatableView):
    def __init__(self, validator, category_service, serializer_cls):
        super().__init__(validator)
        self._category_service = category_service
        self._serializer_cls = serializer_cls

    def get(self, request):
        categories = self._category_service.get_all()
        serialized_categories = [
            self._serializer_cls(category).serialize() for category in categories
        ]
        return {'data': serialized_categories}, OK_CODE

    def post(self, request):
        self._validate(request.data)
        category = self._category_service.create(request.data)
        serialized_category = self._serializer_cls(category).serialize()
        return {'data': serialized_category}, OK_CODE
