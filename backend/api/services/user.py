from django.db import IntegrityError

from api.models import *
from api.services.base import DetailService, ListService
from api.services.utils import is_uniqueness_exception
from api.utils.errors.error_constants import SAME_EMAIL_ERR
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.json_responses import DataJsonResponse, JsonResponseBadRequest, JsonResponseNotFound


class UserService(DetailService):
  def __init__(self, model_id, request):
    super().__init__(User, model_id, request)

  def update(self):
    try:
      data = self.request.parsed_data
      user = User.objects.get(pk=self.model_id)
      group = Group.objects.get(pk=data['group'])
      user.name = data['name']
      password = data['password']
      user.password = User.encrypt_password(password)
      user.group = group
      return DataJsonResponse(user.serialize(**self.request.serializer_data))
    except User.DoesNotExist:
      return JsonResponseNotFound([get_not_exist_msg(User)])
    except Group.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(Group)])


class UserListService(ListService):
  def __init__(self, request):
    super().__init__(User, request)

  def create(self):
    try:
      data = self.request.parsed_data
      group = Group.objects.get(pk=data['group'])
      password = User.encrypt_password(data['password'])
      user = User.objects.create(name=data['name'], email=data['email'],
                                 password=password, group=group, is_active=True)
      return DataJsonResponse(user.serialize(**self.request.serializer_data))
    except Group.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(Group)])
    except IntegrityError as e:
      import re
      if is_uniqueness_exception(e, 'email'):
        return JsonResponseBadRequest(key='email', err=[SAME_EMAIL_ERR])
      raise e
