from src.repos.user import UserRepo
from src.services.user import UserService


class UserServiceFactory:
    @staticmethod
    def create(db_conn):
        user_repo = UserRepo(db_conn)
        return UserService(repo=user_repo)
