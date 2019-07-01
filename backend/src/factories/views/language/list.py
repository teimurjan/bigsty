from src.factories.services.language import LanguageServiceFactory
from src.factories.views.base import ViewFactory
from src.serializers.language import LanguageSerializer
from src.views.language.list import LanguageListView


class LanguageListViewFactory(ViewFactory):
    def create(self, http_method=None):
        service = LanguageServiceFactory.create(self._db_conn)
        return LanguageListView(service=service, serializer_cls=LanguageSerializer)
