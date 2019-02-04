from cerberus import Validator
from src.validation_rules.feature_value.create import CREATE_FEATURE_VALUE_VALIDATION_RULES


class CreateFeatureValueValidatorFactory:
    @staticmethod
    def create():
        return Validator(CREATE_FEATURE_VALUE_VALIDATION_RULES)
