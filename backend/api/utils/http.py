
from django.http import JsonResponse

OK_CODE = 200
BAD_REQUEST_CODE = 400
FORBIDDEN_CODE = 403
UNAUTHORIZED_CODE = 401
SERVER_ERROR_CODE = 500
NOT_FOUND_CODE = 404
UNPROCESSABLE_ENTITY_CODE = 422
METHOD_NOT_ALLOWED_CODE = 405

AUTHORIZATION_HEADER = 'HTTP_AUTHORIZATION'
ACCEPT_LANGUAGE_HEADER = 'HTTP_ACCEPT_LANGUAGE'
HTTP_X_APP_HEADER = 'HTTP_X_APP'


class JSONResponseUnauthorized(JsonResponse):
    def __init__(self, err='Invalid auth credentials', key='global'):
        super().__init__({key: err}, status=UNAUTHORIZED_CODE)


class JSONResponseForbidden(JsonResponse):
    def __init__(self, err='Forbidden', key='global'):
        super().__init__({key: err}, status=FORBIDDEN_CODE)


class JSONResponseServerError(JsonResponse):
    def __init__(self, err='Error has happened', key='global'):
        super().__init__({key: err}, status=SERVER_ERROR_CODE)


class JSONResponseBadRequest(JsonResponse):
    def __init__(self, err, key='global'):
        super().__init__({key: err}, status=BAD_REQUEST_CODE)


class JSONResponseNotFound(JsonResponse):
    def __init__(self, err, key='global'):
        super().__init__({key: err}, status=NOT_FOUND_CODE)


class DataJSONResponse(JsonResponse):
    def __init__(self, data, key='data'):
        super().__init__({key: data})
