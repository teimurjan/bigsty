from cerberus import Validator
from src.validation_rules.product_type.update import UPDATE_PRODUCT_TYPE_VALIDATION_RULES


class UpdateProductTypeValidatorFactory:
    @staticmethod
    def create():
        return Validator(UPDATE_PRODUCT_TYPE_VALIDATION_RULES)
