from cerberus import Validator
from api.validation_rules.feature_value.update import UPDATE_FEATURE_VALUE_VALIDATION_RULES


class UpdateFeatureValueValidatorFactory:
    @staticmethod
    def create():
        return Validator(UPDATE_FEATURE_VALUE_VALIDATION_RULES)
