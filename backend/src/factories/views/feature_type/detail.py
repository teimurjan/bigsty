from src.factories.services.feature_type import FeatureTypeServiceFactory
from src.factories.views.base import ViewFactory
from src.views.feature_type.detail import FeatureTypeDetailView
from src.serializers.feature_type import FeatureTypeSerializer
from src.factories.validators.feature_type.update import UpdateFeatureTypeValidatorFactory


class FeatureTypeDetailViewFactory(ViewFactory):
    def create(self, http_method=None):
        validator = None
        if http_method == 'put':
            validator = UpdateFeatureTypeValidatorFactory.create()
        feature_type_service = FeatureTypeServiceFactory.create(self._db_conn)
        return FeatureTypeDetailView(
            validator=validator,
            service=feature_type_service,
            serializer_cls=FeatureTypeSerializer
        )
