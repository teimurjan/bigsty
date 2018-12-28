import bcrypt
from api.models import User
from api.repos.base import Repo


def encrypt_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode('utf-8')


class UserRepo(Repo):
    def __init__(self):
        super().__init__(User)

    def create(self, email, password):
        return super()._create(email=email, password=encrypt_password(password))
