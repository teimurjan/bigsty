from src.factories.services.feature_value import FeatureValueServiceFactory
from src.factories.views.base import ViewFactory
from src.views.feature_value.detail import FeatureValueDetailView
from src.serializers.feature_value import FeatureValueSerializer
from src.factories.validators.feature_value.update import UpdateFeatureValueValidatorFactory


class FeatureValueDetailViewFactory(ViewFactory):
    def create(self, http_method=None):
        validator = None
        if http_method == 'put':
            validator = UpdateFeatureValueValidatorFactory.create()
        feature_value_service = FeatureValueServiceFactory.create(self._db_conn)
        return FeatureValueDetailView(
            validator=validator,
            service=feature_value_service,
            serializer_cls=FeatureValueSerializer
        )
