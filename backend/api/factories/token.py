import datetime
import jwt
from django.conf import settings

ACCESS_TOKEN_TYPE = 'access'
REFRESH_TOKEN_TYPE = 'refresh'


class TokenFactory:
    @staticmethod
    def create(type_, user):
        if type_ == ACCESS_TOKEN_TYPE:
            exp_date = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            payload = {
                'user_id': user.id,
                'name': user.name,
                'group': user.group.name,
                'exp': exp_date
            }
            return jwt.encode(payload, settings.SECRET_KEY).decode()
        elif type_ == REFRESH_TOKEN_TYPE:
            exp_date = datetime.datetime.utcnow() + datetime.timedelta(days=10)
            payload = {
                'user_id': user.id,
                'exp': exp_date
            }
            return jwt.encode(payload, settings.SECRET_KEY).decode()
        else:
            raise Exception('Unknown token type')
