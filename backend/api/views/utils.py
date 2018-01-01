from django.http import JsonResponse

from api.utils.http_constants import ACCEPT_LANGUAGE_HEADER, BAD_REQUEST_CODE
from api.utils.langauges import LANGUAGES, DEFAULT_LANGUAGE
from api.utils.validator import SchemaValidator, ErrorHandler


def get_language_from_request(request):
  language = request.META.get(ACCEPT_LANGUAGE_HEADER)
  return DEFAULT_LANGUAGE if language not in LANGUAGES else language


def validation_required(func):
  def wrapper(self, request, *args, **kwargs):
    v = SchemaValidator(error_handler=ErrorHandler(prefix=self.error_prefix), schema=self.validation_rules)
    v.validate(request.parsed_data)
    if len(v.errors) > 0: return JsonResponse(v.errors, status=BAD_REQUEST_CODE)
    return func(self, request, *args, **kwargs)

  return wrapper
