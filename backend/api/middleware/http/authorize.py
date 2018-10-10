from api.utils.http import AUTHORIZATION_HEADER, JSONResponseUnauthorized


class AuthorizeHttpMiddleware:
    def __init__(self, user_service):
        self._user_service = user_service

    def handle(self, request):
        try:
            token = request.META[AUTHORIZATION_HEADER].replace('Bearer ', '')
            request.user = self._user_service.authorize(token)
        except KeyError:
            request.user = None
