from cerberus import Validator
from api.validation_rules.feature_type.update import UPDATE_FEATURE_TYPE_VALIDATION_RULES


class UpdateFeatureTypeValidatorFactory:
    @staticmethod
    def create():
        return Validator(UPDATE_FEATURE_TYPE_VALIDATION_RULES)
