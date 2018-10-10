from api.utils.http import OK_CODE
from api.views.base import ValidatableView


class AuthenticationView(ValidatableView):
    def __init__(self, validator, user_service):
        super().__init__(validator)
        self._user_service = user_service

    def post(self, request):
        self._validate(request.data)
        access_token, refresh_token = self._user_service.authenticate(request.data)
        return {'access_token': access_token, 'refresh_token': refresh_token}, OK_CODE
      
