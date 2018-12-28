from api.factories.services.product_type import ProductTypeServiceFactory
from api.factories.views.base import ViewFactory
from api.views.product_type.detail import ProductTypeDetailView
from api.serializers.product_type import ProductTypeSerializer
from api.factories.validators.product_type.update import UpdateProductTypeValidatorFactory


class ProductTypeDetailViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        validator = None
        if http_method == 'put':
            validator = UpdateProductTypeValidatorFactory.create()
        product_type_service = ProductTypeServiceFactory.create()
        return ProductTypeDetailView(
            validator=validator,
            service=product_type_service,
            serializer_cls=ProductTypeSerializer
        )
