from django.http import JsonResponse

from api.models import Group
from api.services.base import ListService


class GroupListService(ListService):
  def __init__(self, request):
    super().__init__(Group, request)

  def create(self) -> JsonResponse:
    raise NotImplementedError()
