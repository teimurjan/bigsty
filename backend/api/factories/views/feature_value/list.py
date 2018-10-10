from api.factories.services.feature_value import FeatureValueServiceFactory
from api.factories.views.base import ViewFactory
from api.views.feature_value.list import FeatureValueListView
from api.serializers.feature_value import FeatureValueSerializer
from api.factories.validators.feature_value.create import CreateFeatureValueValidatorFactory


class FeatureValueListViewFactory(ViewFactory):
    @staticmethod
    def create(http_method=None):
        validator = None
        if http_method == 'post':
            validator = CreateFeatureValueValidatorFactory.create()
        feature_value_service = FeatureValueServiceFactory.create()
        return FeatureValueListView(
            validator=validator,
            service=feature_value_service,
            serializer_cls=FeatureValueSerializer
        )
