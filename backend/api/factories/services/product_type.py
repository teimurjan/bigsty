from api.repos.product_type import ProductTypeRepo
from api.services.product_type import ProductTypeService
from api.repos.product_type.name import ProductTypeNameRepo
from api.repos.product_type.description import ProductTypeDescriptionRepo
from api.repos.product_type.short_description import ProductTypeShortDescriptionRepo
from api.repos.category import CategoryRepo
from api.repos.feature_value import FeatureValueRepo
from api.repos.language import LanguageRepo


class ProductTypeServiceFactory:
    @staticmethod
    def create():
        repo = ProductTypeRepo()
        name_repo = ProductTypeNameRepo()
        description_repo = ProductTypeDescriptionRepo()
        short_description_repo = ProductTypeShortDescriptionRepo()
        category_repo = CategoryRepo()
        feature_value_repo = FeatureValueRepo()
        language_repo = LanguageRepo()
        return ProductTypeService(
            repo=repo,
            name_repo=name_repo,
            description_repo=description_repo,
            short_description_repo=short_description_repo,
            category_repo=category_repo,
            feature_value_repo=feature_value_repo,
            language_repo=language_repo
        )
