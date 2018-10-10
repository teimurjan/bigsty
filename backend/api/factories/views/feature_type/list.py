from api.factories.services.feature_type import FeatureTypeServiceFactory
from api.factories.views.base import ViewFactory
from api.views.feature_type.list import FeatureTypeListView
from api.serializers.feature_type import FeatureTypeSerializer
from api.factories.validators.feature_type.create import CreateFeatureTypeValidatorFactory


class FeatureTypeListViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        validator = None
        if http_method == 'post':
            validator = CreateFeatureTypeValidatorFactory.create()
        feature_type_service = FeatureTypeServiceFactory.create()
        return FeatureTypeListView(
            validator=validator,
            service=feature_type_service,
            serializer_cls=FeatureTypeSerializer
        )
