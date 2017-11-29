from api.models import Language

DEFAULT_LANGUAGE = 'en'
LANGUAGES = Language.objects.all().values_list("name", flat=True)