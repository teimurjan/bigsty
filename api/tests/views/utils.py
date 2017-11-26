from typing import Dict, List

from api.models import Language


def get_intl_texts_errors(prefix: str, error: str = 'mustNotBeNull', field: str = 'name') -> List[dict]:
  get_error_code = lambda language_code: 'errors.{0}.{1}.{2}.{3}'.format(prefix, field, language_code, error)
  return [{language.pk: [get_error_code(language.pk)] for language in Language.objects.all()}]


def get_intl_texts(en: str = None) -> Dict[str, str]:
  return {'en': en}
