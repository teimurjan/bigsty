from django.http import JsonResponse

from api.utils.http_constants import BAD_REQUEST_CODE, NOT_FOUND_CODE, UNAUTHORIZED_CODE, SERVER_ERROR_CODE, \
  FORBIDDEN_CODE


class JsonResponseUnauthorized(JsonResponse):
  def __init__(self, err='Invalid auth credentials', key='global'):
    super().__init__({key: err}, status=UNAUTHORIZED_CODE)


class JsonResponseForbidden(JsonResponse):
  def __init__(self, err='Forbidden', key='global'):
    super().__init__({key: err}, status=FORBIDDEN_CODE)


class JsonResponseServerError(JsonResponse):
  def __init__(self, err='Error has happened', key='global'):
    super().__init__({key: err}, status=SERVER_ERROR_CODE)


class JsonResponseBadRequest(JsonResponse):
  def __init__(self, err, key='global'):
    super().__init__({key: err}, status=BAD_REQUEST_CODE)


class JsonResponseNotFound(JsonResponse):
  def __init__(self, err, key='global'):
    super().__init__({key: err}, status=NOT_FOUND_CODE)


class DataJsonResponse(JsonResponse):
  def __init__(self, data, key='data'):
    super().__init__({key: data})
