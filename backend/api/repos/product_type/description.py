from api.models import ProductTypeDescription
from api.repos.base import Repo


class ProductTypeDescriptionRepo(Repo):
    def __init__(self):
        super().__init__(ProductTypeDescription)
