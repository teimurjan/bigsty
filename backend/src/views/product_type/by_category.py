from src.errors import InvalidEntityFormat
from src.constants.status_codes import OK_CODE
from src.views.base import PaginatableView


class ProductTypeByCategoryView(PaginatableView):
    def __init__(self, service, serializer_cls):
        self._service = service
        self._serializer_cls = serializer_cls

    def get(self, request, category_id):
        categories = self._service.get_by_category_id(category_id)

        meta = None
        page = request.GET.get('page')
        if page:
            limit = request.GET.get('limit', 20)
            categories, meta = self._paginate(categories, page, limit)

        serialized_categories = [
            self._serializer_cls(category).in_language(request.language).serialize() for category in categories
        ]

        return {'data': serialized_categories, 'meta': meta}, OK_CODE
