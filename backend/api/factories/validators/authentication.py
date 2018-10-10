from cerberus import Validator

from api.validation_rules.authentication import AUTHENTICATION_VALIDATION_RULES


class AuthenticationValidatorFactory:
    @staticmethod
    def create():
        return Validator(AUTHENTICATION_VALIDATION_RULES)
