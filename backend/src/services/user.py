from flask import current_app as app

import bcrypt
import jwt

from src.factories.token import TokenFactory, ACCESS_TOKEN_TYPE, REFRESH_TOKEN_TYPE


class UserService:
    def __init__(self, repo):
        self._repo = repo

    def authorize(self, token):
        try:
            decoded_token = jwt.decode(token, app.config['SECRET_KEY'])
            user = self._repo.get_by_id(decoded_token['user_id'])
            return user
        except (jwt.InvalidTokenError, self._repo.DoesNotExist):
            return None

    def authenticate(self, data):
        user = self._repo.get_first_by_email(data['email'])

        if (
            user is None or
            not bcrypt.checkpw(
                data['password'].encode(),
                user.password.encode()
            )
        ):
            raise self.AuthCredsInvalid()

        return (
            TokenFactory.create(ACCESS_TOKEN_TYPE, user),
            TokenFactory.create(REFRESH_TOKEN_TYPE, user)
        )

    def register(self, data):
        name, email, password = data['name'], data['email'], data['password']
        if self._repo.is_email_used(email):
            raise self.SameEmailError()

        user = self._repo.create_user(name, email, password)
        return (
            TokenFactory.create(ACCESS_TOKEN_TYPE, user),
            TokenFactory.create(REFRESH_TOKEN_TYPE, user)
        )

    def refresh_token(self, data):
        try:
            decoded_token = jwt.decode(
                data['refresh_token'], app.config['SECRET_KEY']
            )
            user = self._repo.get_by_id(decoded_token['user_id'])
            return (
                TokenFactory.create(ACCESS_TOKEN_TYPE, user),
                TokenFactory.create(REFRESH_TOKEN_TYPE, user)
            )
        except (jwt.InvalidTokenError, self._repo.DoesNotExist):
            raise self.TokenInvalid()

    class AuthCredsInvalid(Exception):
        pass

    class SameEmailError(Exception):
        pass

    class TokenInvalid(Exception):
        pass
