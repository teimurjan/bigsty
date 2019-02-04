from src.factories.services.product import ProductServiceFactory
from src.factories.views.base import ViewFactory
from src.views.product.detail import ProductDetailView
from src.serializers.product import ProductSerializer
from src.factories.validators.product.update import UpdateProductValidatorFactory


class ProductDetailViewFactory(ViewFactory):
    def create(self, http_method=None):
        validator = None
        if http_method == 'put':
            validator = UpdateProductValidatorFactory.create()
        product_service = ProductServiceFactory.create(self._db_conn)
        return ProductDetailView(
            validator=validator,
            service=product_service,
            serializer_cls=ProductSerializer
        )
