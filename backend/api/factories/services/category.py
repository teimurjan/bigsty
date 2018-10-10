from api.repos.category import CategoryRepo
from api.services.category import CategoryService
from api.repos.category.name import CategoryNameRepo
from api.repos.language import LanguageRepo


class CategoryServiceFactory:
    @staticmethod
    def create():
        repo = CategoryRepo()
        name_repo = CategoryNameRepo()
        language_repo = LanguageRepo()
        return CategoryService(
            repo=repo,
            name_repo=name_repo,
            language_repo=language_repo
        )
