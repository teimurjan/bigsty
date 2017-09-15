from django.db import IntegrityError
from django.http import JsonResponse

from api.models import *
from api.serializers.base import DetailSerializer, DataJsonResponse, ListSerializer
from api.utils.crypt import encrypt
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, SAME_EMAIL_ERR
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields_constants import NAME_FIELD, EMAIL_FIELD, PASSWORD_FIELD, GROUP_FIELD
from api.utils.response_constants import NOT_FOUND_CODE, BAD_REQUEST_CODE


class UserSerializer(DetailSerializer):
  def __init__(self):
    super().__init__(User)

  def update(self):
    try:
      user = User.objects.get(pk=self.model_id)
      user.name = self.data[NAME_FIELD]
      password = self.data[PASSWORD_FIELD]
      user.password = encrypt(password)
      user.group = Group.objects.get(pk=self.data[GROUP_FIELD])
      return DataJsonResponse(user.to_dict())
    except User.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(User)]}, status=NOT_FOUND_CODE)
    except Group.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(Group)]}, status=BAD_REQUEST_CODE)


class UserListSerializer(ListSerializer):
  def __init__(self):
    super().__init__(User)

  def create(self):
    try:
      group = Group.objects.get(pk=self.data[GROUP_FIELD])
      user = User.objects.create(name=self.data[NAME_FIELD], email=self.data[EMAIL_FIELD],
                                 password=self.data[PASSWORD_FIELD], group=group)
      return DataJsonResponse(user.to_dict())
    except Group.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(Group)]}, status=BAD_REQUEST_CODE)
    except IntegrityError as e:
      if 'Duplicate entry' in str(e):
        return JsonResponse({EMAIL_FIELD: [SAME_EMAIL_ERR]}, status=BAD_REQUEST_CODE)
