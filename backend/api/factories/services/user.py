from api.repos.user import UserRepo
from api.services.user import UserService


class UserServiceFactory:
    @staticmethod
    def create():
        user_repo = UserRepo()
        return UserService(repo=user_repo)
