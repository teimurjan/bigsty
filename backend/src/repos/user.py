import bcrypt

from src.repos.base import Repo
from src.models import User


def encrypt_password(password):
    return bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode('utf-8')


class UserRepo(Repo):
    def get_by_id(self, id_):
        with self.session_scope() as s:
            return s.query(User).get(id_)

    def get_first_by_email(self, email):
        with self.session_scope() as s:
            return s.query(User).filter(User.email == email).first()

    def is_email_used(self, email):
        with self.session_scope() as s:
            return s.query(User).filter(User.email == email).count() > 0

    def add_user(self, name, email, password):
        user = User()
        user.name = name
        user.email = email
        user.password = encrypt_password(password)
        user.group_id = 1
        with self.session_scope() as s:
            s.add(user)
            s.flush()

            # fetch group within the session for the future use
            user.group

        return user
