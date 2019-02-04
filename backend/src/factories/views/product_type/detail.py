from src.factories.services.product_type import ProductTypeServiceFactory
from src.factories.views.base import ViewFactory
from src.views.product_type.detail import ProductTypeDetailView
from src.serializers.product_type import ProductTypeSerializer
from src.factories.validators.product_type.update import UpdateProductTypeValidatorFactory


class ProductTypeDetailViewFactory(ViewFactory):
    def create(self, http_method=None):    
        validator = None
        if http_method == 'put':
            validator = UpdateProductTypeValidatorFactory.create()
        product_type_service = ProductTypeServiceFactory.create(self._db_conn)
        return ProductTypeDetailView(
            validator=validator,
            service=product_type_service,
            serializer_cls=ProductTypeSerializer
        )
