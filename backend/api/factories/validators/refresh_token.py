from cerberus import Validator

from api.validation_rules.refresh_token import REFRESH_TOKEN_VALIDATION_RULES


class RefreshTokenValidatorFactory:
    @staticmethod
    def create():
        return Validator(REFRESH_TOKEN_VALIDATION_RULES)
