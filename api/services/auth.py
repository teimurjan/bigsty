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
from api.utils.form_fields import NAME_FIELD, EMAIL_FIELD, PASSWORD_FIELD, TOKEN_KEY, \
  AUTH_FIELDS, ID_FIELD


class AuthService(Service):
  def register(self) -> JsonResponse:
    data = self.request.parsed_data
    name = data[NAME_FIELD]
    email = data[EMAIL_FIELD]
    password = data[PASSWORD_FIELD]
    group = Group.objects.get(pk='reader')
    try:
      user = User.objects.create(name=name, email=email, password=User.encrypt_password(password), group=group)
      user.token = user.generate_registration_token()
      user.save()
      self._send_confirm_email(user)
      return JsonResponse({'message': 'Complete the registration now.'})
    except IntegrityError as e:
      if is_uniqueness_exception(e, EMAIL_FIELD):
        return JsonResponseBadRequest(err=[SAME_EMAIL_ERR], key=EMAIL_FIELD)

  def _send_confirm_email(self, user: Type[User]) -> None:
    subject = 'Complete your registration'
    url = '{host}/register?token={token}'.format(host=self.request.get_host(), token=user.token)
    html_content = '<a href="{0}">Click here to complete your registration.</a>'.format(url)
    EmailService(subject, html_content, to=[user.email]).send()

  def login(self) -> JsonResponse:
    data = self.request.parsed_data
    email = data[EMAIL_FIELD]
    password = data[PASSWORD_FIELD]
    try:
      user = User.objects.get(email=email)
      if user.is_active and user.is_password_matches(password):
        return JsonResponse({TOKEN_KEY: user.generate_token()})
      else:
        return JsonResponseBadRequest(key=AUTH_FIELDS, err=[INVALID_EMAIL_OR_PASSWORD_ERR])
    except User.DoesNotExist:
      return JsonResponseBadRequest(key=AUTH_FIELDS, err=[INVALID_EMAIL_OR_PASSWORD_ERR])

  def complete_registration(self) -> JsonResponse:
    try:
      import jwt
      from main.settings import SECRET_KEY
      token = self.request.GET.get('token')
      decoded_token = jwt.decode(token, SECRET_KEY)
      user = User.objects.get(pk=decoded_token[ID_FIELD])
      if user.is_active: return JsonResponseBadRequest(err=['errors.auth.alreadyActive'])
      token = user.generate_token()
      user.token = token
      user.is_active = True
      user.save()
      return JsonResponse({TOKEN_KEY: token})
    except (KeyError, User.DoesNotExist, DecodeError):
      return JsonResponseBadRequest(err=['errors.auth.invalidToken'])
