from api.models import Category, CategoryName
from api.repos.base import Repo


class CategoryRepo(Repo):
    def __init__(self):
        super().__init__(Category)

    def set_feature_types(self, category, feature_types):
        feature_types_ids = [feature_type.id for feature_type in feature_types]
        category_model_obj = self._get_model_obj_by_id(category.id)
        category_model_obj.feature_types.set(*feature_types_ids)
