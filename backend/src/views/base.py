from src.errors import InvalidEntityFormat


class ValidatableView:
    def __init__(self, validator):
        self._validator = validator

    def _validate(self, data):
        is_valid = self._validator.validate(data)
        if not is_valid:
            raise InvalidEntityFormat(self._validator.errors)


class PaginatableView:
    def _paginate(self, items, page, limit):
        return items, {
            'count': len(items),
            'pages_count': 1,
            'page': 1,
            'limit': 1,
        }
