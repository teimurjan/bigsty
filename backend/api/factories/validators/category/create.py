from cerberus import Validator
from api.validation_rules.category.create import CREATE_CATEGORY_VALIDATION_RULES


class CreateCategoryValidatorFactory:
    @staticmethod
    def create():
        return Validator(CREATE_CATEGORY_VALIDATION_RULES)
