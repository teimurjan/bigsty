from api.models import Category, CategoryName
from api.repos.base import Repo


class CategoryRepo(Repo):
    def __init__(self):
        super().__init__(Category)

    def create(self):
        return super()._create()

    def set_feature_types(self, category, feature_types):
        model_obj = self._get_model_obj_by_id(category.id)
        category.feature_types = []
        feature_types_ids = set()
        for feature_type in feature_types:
            feature_types_ids.add(feature_type.id)
            category.feature_types.append(feature_type)
        model_obj.feature_types.set(feature_types_ids)
            

