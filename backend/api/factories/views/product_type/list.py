from api.factories.services.product_type import ProductTypeServiceFactory
from api.factories.views.base import ViewFactory
from api.views.product_type.list import ProductTypeListView
from api.serializers.product_type import ProductTypeSerializer
from api.factories.validators.product_type.create import CreateProductTypeValidatorFactory


class ProductTypeListViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        validator = None
        if http_method == 'post':
            validator = CreateProductTypeValidatorFactory.create()
        product_type_service = ProductTypeServiceFactory.create()
        return ProductTypeListView(
            validator=validator,
            service=product_type_service,
            serializer_cls=ProductTypeSerializer
        )
