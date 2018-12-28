from api.factories.services.product import ProductServiceFactory
from api.factories.views.base import ViewFactory
from api.views.product.detail import ProductDetailView
from api.serializers.product import ProductSerializer
from api.factories.validators.product.update import UpdateProductValidatorFactory


class ProductDetailViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        validator = None
        if http_method == 'put':
            validator = UpdateProductValidatorFactory.create()
        product_service = ProductServiceFactory.create()
        return ProductDetailView(
            validator=validator,
            service=product_service,
            serializer_cls=ProductSerializer
        )
