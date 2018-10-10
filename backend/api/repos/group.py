from api.models import Group
from api.repos.base import Repo


class GroupRepo(Repo):
    def __init__(self):
        super().__init__(Group)
