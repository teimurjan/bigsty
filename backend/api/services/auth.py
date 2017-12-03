from typing import Type

from django.db import IntegrityError
from django.http import JsonResponse
from jwt import DecodeError

from api.models import Group, User
from api.services.base import Service
from api.services.email import EmailService
from api.services.utils import is_uniqueness_exception
from api.utils.json_responses import JsonResponseBadRequest
from api.utils.errors.error_constants import SAME_EMAIL_ERR, INVALID_EMAIL_OR_PASSWORD_ERR
from api.utils.form_fields import NAME_FIELD, EMAIL_FIELD, PASSWORD_FIELD, ACCESS_TOKEN_KEY, \
  AUTH_FIELDS, ID_FIELD, REFRESH_TOKEN_KEY


class AuthService(Service):
  def register(self) -> JsonResponse:
    data = self.request.parsed_data
    name = data[NAME_FIELD]
    email = data[EMAIL_FIELD]
    password = data[PASSWORD_FIELD]
    group = Group.objects.get(pk='reader')
    try:
      user = User.objects.create(name=name, email=email, password=User.encrypt_password(password), group=group)
      token = user.generate_registration_token()
      self._send_confirm_email(user.email, token)
      return JsonResponse({'message': 'Complete the registration now.'})
    except IntegrityError as e:
      if is_uniqueness_exception(e, EMAIL_FIELD):
        return JsonResponseBadRequest(err=[SAME_EMAIL_ERR], key=EMAIL_FIELD)

  def complete_registration(self) -> JsonResponse:
    try:
      import jwt
      from main.settings import SECRET_KEY
      token = self.request.GET.get('token')
      decoded_token = jwt.decode(token, SECRET_KEY)
      user = User.objects.get(pk=decoded_token[ID_FIELD])
      if user.is_active: return JsonResponseBadRequest(err=['errors.completeRegistration.alreadyActive'])
      user.is_active = True
      user.save()
      return JsonResponse({ACCESS_TOKEN_KEY: user.generate_access_token(),
                           REFRESH_TOKEN_KEY: user.generate_refresh_token()})
    except (KeyError, User.DoesNotExist, DecodeError):
      return JsonResponseBadRequest(err=['errors.completeRegistration.invalidToken'])

  def _send_confirm_email(self, email_address: str, token: str) -> None:
    subject = 'Complete your registration'
    url = '{host}/register?token={token}'.format(host=self.request.get_host(), token=token)
    html_content = '<a href="{0}">Click here to complete your registration.</a>'.format(url)
    EmailService(subject, html_content, to=[email_address]).send()

  def login(self) -> JsonResponse:
    data = self.request.parsed_data
    email = data[EMAIL_FIELD]
    password = data[PASSWORD_FIELD]
    try:
      user = User.objects.get(email=email)
      if user.is_active and user.is_password_matches(password):
        return JsonResponse({ACCESS_TOKEN_KEY: user.generate_access_token(),
                             REFRESH_TOKEN_KEY: user.generate_refresh_token()})
      else:
        return JsonResponseBadRequest(key=AUTH_FIELDS, err=[INVALID_EMAIL_OR_PASSWORD_ERR])
    except User.DoesNotExist:
      return JsonResponseBadRequest(key=AUTH_FIELDS, err=[INVALID_EMAIL_OR_PASSWORD_ERR])

  #TODO Add refresh token method
  def refresh(self) -> JsonResponse:
    pass
