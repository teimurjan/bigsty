from api.factories.services.category import CategoryServiceFactory
from api.factories.views.base import ViewFactory
from api.views.category.detail import CategoryDetailView
from api.serializers.category import CategorySerializer
from api.factories.validators.category.update import UpdateCategoryValidatorFactory


class CategoryDetailViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        validator = None
        if http_method == 'put':
            validator = UpdateCategoryValidatorFactory.create()
        category_service = CategoryServiceFactory.create()
        return CategoryDetailView(
            validator=validator,
            service=category_service,
            serializer_cls=CategorySerializer
        )
