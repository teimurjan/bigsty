from django.http import JsonResponse

from api.utils.errors.error_constants import GLOBAL_ERR_KEY, NO_DATA_ERR

MESSAGE_KEY = 'message'
MESSAGE_OK = {MESSAGE_KEY: 'ok'}

OK_CODE = 200
BAD_REQUEST_CODE = 400
FORBIDDEN_CODE = 403
NOT_FOUND_CODE = 404

EMPTY_DATA_RESPONSE = JsonResponse({GLOBAL_ERR_KEY: [NO_DATA_ERR]}, status=BAD_REQUEST_CODE)
