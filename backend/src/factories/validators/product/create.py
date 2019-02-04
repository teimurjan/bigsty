from cerberus import Validator
from src.validation_rules.product.create import CREATE_PRODUCT_VALIDATION_RULES


class CreateProductValidatorFactory:
    @staticmethod
    def create():
        return Validator(CREATE_PRODUCT_VALIDATION_RULES)
