import jwt
from django.db import IntegrityError
from django.http import JsonResponse

from api.models import Group, User
from api.serializers.base import BaseSerializer
from api.utils.crypt import encrypt, matches
from api.utils.errors.error_constants import SAME_EMAIL_ERR, INVALID_EMAIL_OR_PASSWORD_ERR
from api.utils.form_fields_constants import NAME_FIELD, EMAIL_FIELD, PASSWORD_FIELD, GROUP_FIELD, ID_FIELD, TOKEN_KEY, \
  AUTH_FIELDS
from api.utils.response_constants import BAD_REQUEST_CODE
from main import settings


def generate_token(user):
  payload = {ID_FIELD: user.pk, NAME_FIELD: user.name, GROUP_FIELD: user.group.name}
  return jwt.encode(payload, settings.SECRET_KEY).decode()


class AuthSerializer(BaseSerializer):
  def register(self):
    try:
      name = self.data[NAME_FIELD]
      email = self.data[EMAIL_FIELD]
      password = self.data[PASSWORD_FIELD]
      group, created = Group.objects.get_or_create(name='reader')
      user = User.objects.create(name=name, email=email, password=encrypt(password), group=group)
      return JsonResponse({TOKEN_KEY: generate_token(user)})
    except IntegrityError as e:
      if 'Duplicate entry' in str(e):
        return JsonResponse({EMAIL_FIELD: [SAME_EMAIL_ERR]}, status=BAD_REQUEST_CODE)

  def login(self):
    email = self.data[EMAIL_FIELD]
    password = self.data[PASSWORD_FIELD]
    try:
      user = User.objects.get(email=email)
      if matches(password, user.password):
        return JsonResponse({TOKEN_KEY: generate_token(user)})
      else:
        return JsonResponse({AUTH_FIELDS: [INVALID_EMAIL_OR_PASSWORD_ERR]}, status=BAD_REQUEST_CODE)
    except User.DoesNotExist:
      return JsonResponse({AUTH_FIELDS: [INVALID_EMAIL_OR_PASSWORD_ERR]}, status=BAD_REQUEST_CODE)
