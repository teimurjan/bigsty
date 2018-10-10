from api.factories.services.product import ProductServiceFactory
from api.factories.views.base import ViewFactory
from api.views.product.list import ProductListView
from api.serializers.product import ProductSerializer
from api.factories.validators.product.create import CreateProductValidatorFactory


class ProductListViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        validator = None
        if http_method == 'post':
            validator = CreateProductValidatorFactory.create()
        product_service = ProductServiceFactory.create()
        return ProductListView(
            validator=validator,
            service=product_service,
            serializer_cls=ProductSerializer
        )
