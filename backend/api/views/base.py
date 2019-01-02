from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from api.errors import InvalidEntityFormat

class ValidatableView:
    def __init__(self, validator):
        self._validator = validator

    def _validate(self, data):
        is_valid = self._validator.validate(data)
        if not is_valid:
            raise InvalidEntityFormat(self._validator.errors)


class PaginatableView:
    def _paginate(self, items, page, limit):
        paginator = Paginator(items, limit)
        try:
            return paginator.page(page), {
                'count': paginator.count,
                'pages_count': paginator.num_pages,
                'page': int(page),
                'limit': int(limit),
            }
        except (EmptyPage, PageNotAnInteger):
            return [], None
