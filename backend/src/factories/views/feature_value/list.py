from src.factories.services.feature_value import FeatureValueServiceFactory
from src.factories.views.base import ViewFactory
from src.views.feature_value.list import FeatureValueListView
from src.serializers.feature_value import FeatureValueSerializer
from src.factories.validators.feature_value.create import CreateFeatureValueValidatorFactory


class FeatureValueListViewFactory(ViewFactory):
    def create(self, http_method=None):
        validator = None
        if http_method == 'post':
            validator = CreateFeatureValueValidatorFactory.create()
        feature_value_service = FeatureValueServiceFactory.create(self._db_conn)
        return FeatureValueListView(
            validator=validator,
            service=feature_value_service,
            serializer_cls=FeatureValueSerializer
        )
