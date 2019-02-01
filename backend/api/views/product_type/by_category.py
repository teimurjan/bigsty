from api.errors import InvalidEntityFormat
from api.http.status_codes import OK_CODE


class ProductTypeByCategoryView:
    def __init__(self, service, serializer_cls):
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request, category_id):
        categories = self._service.get_by_category_id(category_id)
        serialized_categories = [
            self._serializer_cls(category).in_language(request.language).serialize() for category in categories
        ]
        return {'data': serialized_categories}, OK_CODE
