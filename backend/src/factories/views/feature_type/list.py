from src.factories.services.feature_type import FeatureTypeServiceFactory
from src.factories.views.base import ViewFactory
from src.views.feature_type.list import FeatureTypeListView
from src.serializers.feature_type import FeatureTypeSerializer
from src.factories.validators.feature_type.create import CreateFeatureTypeValidatorFactory


class FeatureTypeListViewFactory(ViewFactory):
    def create(self, http_method=None):
        validator = None
        if http_method == 'post':
            validator = CreateFeatureTypeValidatorFactory.create()
        feature_type_service = FeatureTypeServiceFactory.create(self._db_conn)
        return FeatureTypeListView(
            validator=validator,
            service=feature_type_service,
            serializer_cls=FeatureTypeSerializer
        )
