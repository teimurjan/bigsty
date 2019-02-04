import bcrypt


def encrypt_password(password):
    return bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode('utf-8')


class UserRepo:
    pass
