from cerberus import Validator
from api.validation_rules.product_type.create import CREATE_PRODUCT_TYPE_VALIDATION_RULES


class CreateProductTypeValidatorFactory:
    @staticmethod
    def create():
        return Validator(CREATE_PRODUCT_TYPE_VALIDATION_RULES)
