from src.factories.services.product_type import ProductTypeServiceFactory
from src.factories.views.base import ViewFactory
from src.views.product_type.list import ProductTypeListView
from src.serializers.product_type import ProductTypeSerializer
from src.factories.validators.product_type.create import CreateProductTypeValidatorFactory


class ProductTypeListViewFactory(ViewFactory):
    def create(self, http_method=None):
        validator = None
        if http_method == 'post':
            validator = CreateProductTypeValidatorFactory.create()
        product_type_service = ProductTypeServiceFactory.create(self._db_conn)
        return ProductTypeListView(
            validator=validator,
            service=product_type_service,
            serializer_cls=ProductTypeSerializer
        )
