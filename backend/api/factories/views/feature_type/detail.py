from api.factories.services.feature_type import FeatureTypeServiceFactory
from api.factories.views.base import ViewFactory
from api.views.feature_type.detail import FeatureTypeDetailView
from api.serializers.feature_type import FeatureTypeSerializer
from api.factories.validators.feature_type.update import UpdateFeatureTypeValidatorFactory


class FeatureTypeDetailViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        validator = None
        if http_method == 'put':
            validator = UpdateFeatureTypeValidatorFactory.create()
        feature_type_service = FeatureTypeServiceFactory.create()
        return FeatureTypeDetailView(
            validator=validator,
            service=feature_type_service,
            serializer_cls=FeatureTypeSerializer
        )
