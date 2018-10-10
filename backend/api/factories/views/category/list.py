from api.factories.services.category import CategoryServiceFactory
from api.factories.views.base import ViewFactory
from api.views.category.list import CategoryListView
from api.serializers.category import CategorySerializer
from api.factories.validators.category.create import CreateCategoryValidatorFactory


class CategoryListViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        validator = None
        if http_method == 'post':
            validator = CreateCategoryValidatorFactory.create()
        category_service = CategoryServiceFactory.create()
        return CategoryListView(
            validator=validator,
            category_service=category_service,
            serializer_cls=CategorySerializer
        )
