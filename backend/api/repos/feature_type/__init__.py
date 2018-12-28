from api.models import FeatureType
from api.repos.base import Repo


class FeatureTypeRepo(Repo):
    def __init__(self):
        super().__init__(FeatureType)

    def get_for_category(self, category):
        return self.filter_by(categories__id=category.id)

    def create(self):
        return super()._create()
