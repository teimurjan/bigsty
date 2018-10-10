from api.models import CategoryName
from api.repos.base import Repo


class CategoryNameRepo(Repo):
    def __init__(self):
        super().__init__(CategoryName)
