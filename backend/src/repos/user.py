import bcrypt

from src.repos.base import Repo
from src.models import User


def encrypt_password(password):
    return bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode('utf-8')


class UserRepo(Repo):
    def __init__(self, db_conn):
        super().__init__(db_conn, User)

    @Repo.with_session
    def get_first_by_email(self, email, session):
        return session.query(User).filter(User.email == email).first()

    @Repo.with_session
    def is_email_used(self, email, session):
        return session.query(User).filter(User.email == email).count() > 0
    
    @Repo.with_session
    def create_user(self, name, email, password, session):
        user = User()
        user.name = name
        user.email = email
        user.password = encrypt_password(password)
        user.group_id = 1

        session.add(user)
        session.flush()

        # fetch group within the session for the future use
        user.group

        return user

    class DoesNotExist(Exception):
        pass