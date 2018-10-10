from api.models import ProductTypeName
from api.repos.base import Repo


class ProductTypeNameRepo(Repo):
    def __init__(self):
        super().__init__(ProductTypeName)
