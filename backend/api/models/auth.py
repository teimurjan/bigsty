import datetime
import uuid

import bcrypt
import jwt
from django.db import models

from api.models.base import SerializableModel
from main.settings import SECRET_KEY


class Group(SerializableModel):
  name = models.CharField(max_length=60, unique=True, blank=False, null=False, primary_key=True)

  class Meta:
    db_table = 'api_user_group'


class User(SerializableModel):
  hidden_fields = ['password', 'auth_credentials']

  email = models.EmailField(unique=True, blank=False, null=False)
  name = models.CharField(max_length=60, blank=False, null=False)
  date_joined = models.DateTimeField(auto_now_add=True)
  password = models.CharField(max_length=255, blank=False, null=False)
  group = models.ForeignKey(Group, related_name='users', related_query_name='user',
                            db_column='group', on_delete=models.CASCADE)
  is_active = models.BooleanField(default=False)

  @staticmethod
  def encrypt_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode('utf-8')

  def is_password_matches(self, password: str) -> bool:
    return bcrypt.checkpw(password.encode(), self.password.encode())

  def generate_access_token(self) -> str:
    exp_date = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    payload = {'user_id': self.pk, 'name': self.name, 'group': self.group.pk, "exp": exp_date}
    return jwt.encode(payload, SECRET_KEY).decode()

  def generate_refresh_token(self, client_id) -> str:
    auth_credentials = UserAuthCredentials.objects.create(client_id=client_id, user=self)
    return auth_credentials.to_jwt()

  def generate_registration_token(self) -> str:
    exp_date = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    payload = {'user_id': self.pk, "exp": exp_date}
    return jwt.encode(payload, SECRET_KEY).decode()

  def _get_field_value(self, field_name):
    if field_name == 'date_joined':
      return getattr(self, field_name).__str__()
    else:
      return super()._get_field_value(field_name)

  def __str__(self):
    return self.email


class UserAuthCredentials(SerializableModel):
  client_id = models.IntegerField()
  user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='auth_credentials',
                           related_query_name='auth_credential')
  jti = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

  def to_jwt(self):
    exp_date = datetime.datetime.utcnow() + datetime.timedelta(days=30)
    payload = {'user_id': self.user.pk, 'client_id': self.client_id, 'jti': str(self.jti), 'exp': exp_date}
    return jwt.encode(payload, SECRET_KEY).decode()

  class Meta:
    db_table = 'api_user_auth_credentials'
