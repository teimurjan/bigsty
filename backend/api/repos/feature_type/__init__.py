from api.models import FeatureType
from api.repos.base import Repo


class FeatureTypeRepo(Repo):
    def __init__(self):
        super().__init__(FeatureType)

    def associate_with_category(self, category, feature_type):
        ft = self._get_model_obj_by_id(feature_type)
        ft.categories.add(category.id)
        
