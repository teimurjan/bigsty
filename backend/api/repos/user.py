import bcrypt
from api.models import User
from api.repos.base import Repo


def encrypt_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode('utf-8')


class UserRepo(Repo):
    def __init__(self):
        super().__init__(User)

    def create(self, password, **kwargs):
        return super().create(password=encrypt_password(password), **kwargs)

    def update(self, user_id, password=None, **kwargs):
        if password:
            return super().update(user_id, password=encrypt_password(password), **kwargs)
        else:
            return super().update(user_id, **kwargs)

    def filter_by_roles(self, roles):
        return (user.to_dto() for user in self.model_cls.objects.filter(role__in=roles).order_by('pk'))
