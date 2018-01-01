import json
from json import JSONDecodeError

from django.http import JsonResponse
from django.views import View

from api.exceptions import EmptyDataError
from api.factories.services import ServiceFactory, ServiceType
from api.services.base import DetailService, ListService
from api.utils.http_constants import HTTP_X_APP_HEADER
from api.utils.json_responses import JsonResponseBadRequest, JsonResponseServerError
from api.utils.json_utils import parse_json_or_none
from api.views.utils import get_language_from_request, validation_required
from main.settings import DEBUG


def get_parsed_payload(request) -> dict:
  json_data = request.body.decode()
  data = json.loads(json_data)
  if data is None:
    raise EmptyDataError
  return data


def get_serializer_data(request) -> dict:
  serializer_data = {}
  serializer_data.update({'language': get_language_from_request(request)})
  serialize_query, exclude_query = request.GET.get('serialize'), request.GET.get('exclude')
  if serialize_query:
    serializer_data.update({'serialize': parse_json_or_none(serialize_query)})
  if exclude_query:
    serializer_data.update({'exclude': parse_json_or_none(exclude_query)})
  return serializer_data


class BaseView(View):
  auth_rules: dict = None

  def __init__(self, service_type: ServiceType, error_prefix: str, **kwargs):
    super().__init__(**kwargs)
    self.service_type = service_type
    self.error_prefix = error_prefix
    self.validation_rules = None

  def dispatch(self, request, *args, **kwargs) -> JsonResponse:
    try:
      request.serializer_data = get_serializer_data(request)
      request.client_id = request.META.get(HTTP_X_APP_HEADER)
      if not request.client_id:
        return JsonResponseBadRequest('Unknown client')
      if request.method == 'POST' or request.method == 'PUT':
        request.parsed_data = get_parsed_payload(request)
      return super(BaseView, self).dispatch(request, *args, **kwargs)
    except (JSONDecodeError, EmptyDataError):
      return JsonResponseBadRequest('Invalid JSON format')
    except Exception as e:
      if DEBUG:
        raise e
      else:
        return JsonResponseServerError()


class DetailView(BaseView):
  auth_rules = {
    'GET': ['anonymous', 'reader', 'manager', 'admin'],
    'PUT': ['manager', 'admin'],
    'DELETE': ['manager', 'admin'],
  }

  def get(self, request, model_id: int) -> JsonResponse:
    service: DetailService = ServiceFactory.create(self.service_type, request=request, model_id=model_id)
    return service.read()

  @validation_required
  def put(self, request, model_id: int) -> JsonResponse:
    service: DetailService = ServiceFactory.create(self.service_type, request=request, model_id=model_id)
    return service.update()

  def delete(self, request, model_id: int) -> JsonResponse:
    service: DetailService = ServiceFactory.create(self.service_type, request=request, model_id=model_id)
    return service.delete()


class ListView(BaseView):
  auth_rules = {
    'GET': ['anonymous', 'reader', 'manager', 'admin'],
    'POST': ['manager', 'admin'],
  }

  @validation_required
  def post(self, request) -> JsonResponse:
    service: ListService = ServiceFactory.create(self.service_type, request=request)
    return service.create()

  def get(self, request) -> JsonResponse:
    service: ListService = ServiceFactory.create(self.service_type, request=request)
    return service.read(**request.GET.dict())
