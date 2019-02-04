from src.factories.services.category import CategoryServiceFactory
from src.factories.views.base import ViewFactory
from src.views.category.detail import CategoryDetailView
from src.serializers.category import CategorySerializer
from src.factories.validators.category.update import UpdateCategoryValidatorFactory


class CategoryDetailViewFactory(ViewFactory):
    def create(self, http_method=None):
        validator = None
        if http_method == 'put':
            validator = UpdateCategoryValidatorFactory.create()
        category_service = CategoryServiceFactory.create(self._db_conn)
        return CategoryDetailView(
            validator=validator,
            service=category_service,
            serializer_cls=CategorySerializer
        )
