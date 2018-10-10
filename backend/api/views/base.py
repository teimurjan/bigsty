from api.utils.errors import InvalidEntityFormat


class ValidatableView:
    def __init__(self, validator):
        self._validator = validator

    def _validate(self, data):
        is_valid = self._validator.validate(data)
        if not is_valid:
            raise InvalidEntityFormat(self._validator.errors)