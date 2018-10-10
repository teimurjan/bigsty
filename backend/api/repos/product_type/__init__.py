from api.models import ProductType
from api.repos.base import Repo


class ProductTypeRepo(Repo):
    def __init__(self):
        super().__init__(ProductType)
