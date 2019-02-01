from api.factories.services.product_type import ProductTypeServiceFactory
from api.factories.views.base import ViewFactory
from api.views.product_type.by_category import ProductTypeByCategoryView
from api.serializers.product_type import ProductTypeSerializer
from api.factories.validators.product_type.create import CreateProductTypeValidatorFactory


class ProductTypeByCategoryViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        product_type_service = ProductTypeServiceFactory.create()
        return ProductTypeByCategoryView(
            service=product_type_service,
            serializer_cls=ProductTypeSerializer
        )
