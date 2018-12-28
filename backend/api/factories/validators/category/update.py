from cerberus import Validator
from api.validation_rules.category.update import UPDATE_CATEGORY_VALIDATION_RULES


class UpdateCategoryValidatorFactory:
    @staticmethod
    def create():
        return Validator(UPDATE_CATEGORY_VALIDATION_RULES)
