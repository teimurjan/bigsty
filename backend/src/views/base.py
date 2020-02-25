import math

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
        pages_count = math.ceil(len(items) / limit)
        starting_item_index = limit * (page - 1)
        ending_item_index = starting_item_index + limit
        return items[starting_item_index: ending_item_index], {
            'count': len(items),
            'pages_count': pages_count,
            'page': page,
            'limit': limit,
        }
