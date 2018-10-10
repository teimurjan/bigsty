from api.models import ProductTypeShortDescription
from api.repos.base import Repo


class ProductTypeShortDescriptionRepo(Repo):
    def __init__(self):
        super().__init__(ProductTypeShortDescription)
