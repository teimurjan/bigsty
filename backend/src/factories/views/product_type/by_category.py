from src.factories.services.product_type import ProductTypeServiceFactory
from src.factories.views.base import ViewFactory
from src.views.product_type.by_category import ProductTypeByCategoryView
from src.serializers.product_type import ProductTypeSerializer
from src.factories.validators.product_type.create import CreateProductTypeValidatorFactory


class ProductTypeByCategoryViewFactory(ViewFactory):
    def create(self, http_method=None):
        product_type_service = ProductTypeServiceFactory.create(self._db_conn)
        return ProductTypeByCategoryView(
            service=product_type_service,
            serializer_cls=ProductTypeSerializer
        )
