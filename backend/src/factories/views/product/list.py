from src.factories.services.product import ProductServiceFactory
from src.factories.views.base import ViewFactory
from src.views.product.list import ProductListView
from src.serializers.product import ProductSerializer
from src.factories.validators.product.create import CreateProductValidatorFactory


class ProductListViewFactory(ViewFactory):
    def create(self, http_method=None):
        validator = None
        if http_method == 'post':
            validator = CreateProductValidatorFactory.create()
        product_service = ProductServiceFactory.create(self._db_conn)
        return ProductListView(
            validator=validator,
            service=product_service,
            serializer_cls=ProductSerializer
        )
