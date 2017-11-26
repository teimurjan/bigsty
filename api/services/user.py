from django.db import IntegrityError
from django.http import JsonResponse

from api.models import *
from api.models.utils import ModelToDictTransformer
from api.services.base import DetailService, ListService
from api.services.utils import is_uniqueness_exception
from api.utils.json_responses import DataJsonResponse, JsonResponseBadRequest
from api.utils.errors.error_constants import GLOBAL_ERR_KEY, SAME_EMAIL_ERR
from api.utils.errors.error_messages import get_not_exist_msg
from api.utils.form_fields import NAME_FIELD, EMAIL_FIELD, PASSWORD_FIELD, GROUP_FIELD
from api.utils.http_constants import NOT_FOUND_CODE, BAD_REQUEST_CODE


class UserService(DetailService):
  def __init__(self, model_id, transformer: ModelToDictTransformer):
    super().__init__(User, model_id, transformer)

  def update(self):
    try:
      user = User.objects.get(pk=self.model_id)
      user.name = self.data[NAME_FIELD]
      password = self.data[PASSWORD_FIELD]
      user.password = encrypt(password)
      user.group = Group.objects.get(pk=self.data[GROUP_FIELD])
      return DataJsonResponse(self.transformer.handle(user))
    except User.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(User)]}, status=NOT_FOUND_CODE)
    except Group.DoesNotExist:
      return JsonResponse({GLOBAL_ERR_KEY: [get_not_exist_msg(Group)]}, status=BAD_REQUEST_CODE)


class UserListService(ListService):
  def __init__(self, request):
    super().__init__(User, request)

  def create(self):
    try:
      data = self.request.parsed_data
      group = Group.objects.get(pk=data[GROUP_FIELD])
      user = User.objects.create(name=data[NAME_FIELD], email=data[EMAIL_FIELD],
                                 password=data[PASSWORD_FIELD], group=group)
      return DataJsonResponse(user.serialize(**self.request.serializer_data))
    except Group.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(Group)])
    except IntegrityError as e:
      import re
      if is_uniqueness_exception(e, EMAIL_FIELD):
        return JsonResponseBadRequest(key=EMAIL_FIELD, err=[SAME_EMAIL_ERR])
      raise e
