from api.factories.services.feature_value import FeatureValueServiceFactory
from api.factories.views.base import ViewFactory
from api.views.feature_value.detail import FeatureValueDetailView
from api.serializers.feature_value import FeatureValueSerializer
from api.factories.validators.feature_value.update import UpdateFeatureValueValidatorFactory


class FeatureValueDetailViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        validator = None
        if http_method == 'put':
            validator = UpdateFeatureValueValidatorFactory.create()
        feature_value_service = FeatureValueServiceFactory.create()
        return FeatureValueDetailView(
            validator=validator,
            service=feature_value_service,
            serializer_cls=FeatureValueSerializer
        )
