from src.factories.services.category import CategoryServiceFactory
from src.factories.views.base import ViewFactory
from src.views.category.list import CategoryListView
from src.serializers.category import CategorySerializer
from src.factories.validators.category.create import CreateCategoryValidatorFactory


class CategoryListViewFactory(ViewFactory):
    def create(self, http_method=None):
        validator = None
        if http_method == 'post':
            validator = CreateCategoryValidatorFactory.create()
        category_service = CategoryServiceFactory.create(self._db_conn)
        return CategoryListView(
            validator=validator,
            service=category_service,
            serializer_cls=CategorySerializer
        )
