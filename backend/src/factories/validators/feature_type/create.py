from cerberus import Validator
from src.validation_rules.feature_type.create import CREATE_FEATURE_TYPE_VALIDATION_RULES


class CreateFeatureTypeValidatorFactory:
    @staticmethod
    def create():
        return Validator(CREATE_FEATURE_TYPE_VALIDATION_RULES)
