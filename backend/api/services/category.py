from api.models import Category, FeatureType
from api.services.base import ListService, DetailService
from api.utils.json_responses import DataJsonResponse, JsonResponseNotFound, JsonResponseBadRequest
from api.utils.errors.error_messages import get_not_exist_msg


class CategoryListService(ListService):
  def __init__(self, request):
    super().__init__(Category, request)

  def create(self):
    try:
      data = self.request.parsed_data
      names = data['name']
      feature_types = [FeatureType.objects.get(pk=pk) for pk in data['feature_types']]
      category = Category.objects.create().add_names(names)
      category.feature_types.set(feature_types)
      return DataJsonResponse(category.serialize(**self.request.serializer_data))
    except FeatureType.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(FeatureType)])


class CategoryService(DetailService):
  def __init__(self, model_id: int, request):
    super().__init__(Category, model_id, request)

  def update(self):
    try:
      data = self.request.parsed_data
      category = Category.objects.get(pk=self.model_id)
      names = data['name']
      category.update_names(names)
      feature_types = [FeatureType.objects.get(pk=pk) for pk in data['feature_types']]
      category.feature_types.set(feature_types)
      return DataJsonResponse(category.serialize(**self.request.serializer_data))
    except FeatureType.DoesNotExist:
      return JsonResponseBadRequest([get_not_exist_msg(FeatureType)])
    except Category.DoesNotExist:
      return JsonResponseNotFound([get_not_exist_msg(Category)])
