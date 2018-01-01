from django.db import IntegrityError
from django.http import JsonResponse
import jwt

from api.models import Group, User
from api.models.auth import UserAuthCredentials
from api.services.base import Service
from api.services.email import EmailService
from api.services.utils import is_uniqueness_exception
from api.utils.json_responses import JsonResponseBadRequest, JsonResponseUnauthorized
from api.utils.errors.error_constants import SAME_EMAIL_ERR, INVALID_EMAIL_OR_PASSWORD_ERR
from main import settings


class AuthService(Service):
  def register(self) -> JsonResponse:
    try:
      data = self.request.parsed_data
      group = Group.objects.get(pk='reader')
      user = User.objects.create(name=data['name'], email=data['email'], group=group,
                                 password=User.encrypt_password(data['password']))
      token = user.generate_registration_token()
      self._send_confirm_email(user.email, token)
      return JsonResponse({'message': 'Complete the registration now.'})
    except IntegrityError as e:
      if is_uniqueness_exception(e, 'email'):
        return JsonResponseBadRequest(err=[SAME_EMAIL_ERR], key='email')
      else:
        raise e

  def complete_registration(self) -> JsonResponse:
    try:
      token = self.request.GET.get('token')
      decoded_token = jwt.decode(token, settings.SECRET_KEY)
      user = User.objects.get(pk=decoded_token['user_id'])
      if user.is_active:
        return JsonResponseBadRequest(err=['errors.completeRegistration.alreadyActive'])
      user.is_active = True
      user.save()
      auth_credentials = UserAuthCredentials.objects.create(client_id=self.request.client_id, user=user)
      return JsonResponse({'access_token': user.generate_access_token(),
                           'refresh_token': auth_credentials.to_jwt()})
    except (KeyError, User.DoesNotExist, jwt.DecodeError):
      return JsonResponseBadRequest(err=['errors.completeRegistration.invalidToken'])

  def _send_confirm_email(self, email_address: str, token: str) -> None:
    subject = 'Complete your registration'
    url = '{host}/register?token={token}'.format(host=self.request.get_host(), token=token)
    html_content = '<a href="{0}">Click here to complete your registration.</a>'.format(url)
    EmailService(subject, html_content, to=[email_address]).send()

  def login(self) -> JsonResponse:
    try:
      data = self.request.parsed_data
      user = User.objects.get(email=data['email'])
      if user.is_active and user.is_password_matches(data['password']):
        auth_credentials = UserAuthCredentials.objects.create(client_id=self.request.client_id, user=user)
        return JsonResponse({'access_token': user.generate_access_token(),
                             'refresh_token': auth_credentials.to_jwt()})
      else:
        return JsonResponseBadRequest(key='auth', err=[INVALID_EMAIL_OR_PASSWORD_ERR])
    except User.DoesNotExist:
      return JsonResponseBadRequest(key='auth', err=[INVALID_EMAIL_OR_PASSWORD_ERR])

  def refresh(self) -> JsonResponse:
    try:
      data = self.request.parsed_data
      decoded_token = jwt.decode(data['refresh_token'], settings.SECRET_KEY)
      auth_credentials = UserAuthCredentials.objects.get(pk=decoded_token['jti'])
      is_client_valid = decoded_token['client_id'] == auth_credentials.client_id
      is_user_id_valid = decoded_token['user_id'] == auth_credentials.user_id
      if is_client_valid and is_user_id_valid:
        user = User.objects.get(pk=decoded_token['user_id'])
        return JsonResponse({'access_token': user.generate_access_token(),
                             'refresh_token': auth_credentials.to_jwt()})
      else:
        auth_credentials.delete()
        return JsonResponseUnauthorized()
    except (jwt.DecodeError, UserAuthCredentials.DoesNotExist):
      return JsonResponseUnauthorized()
