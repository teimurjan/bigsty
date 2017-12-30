from django.http import JsonResponse

from api.services.base import ListService


class GroupService(ListService):
  def create(self) -> JsonResponse:
    raise NotImplementedError()
