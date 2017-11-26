from django.db import models
import bcrypt
from api.utils.form_fields import ID_FIELD, NAME_FIELD, GROUP_FIELD
from main.settings import SECRET_KEY
import jwt
from api.models.base import SerializableModel


class Group(SerializableModel):
  name = models.CharField(max_length=60, unique=True, blank=False, null=False, primary_key=True)

  class Meta:
    db_table = 'api_user_group'


class Permission(SerializableModel):
  name = models.CharField(max_length=60, unique=True, blank=False, null=False)
  groups = models.ManyToManyField(Group, related_name='permissions', related_query_name='permission',
                                  db_table='api_user_permission_x_group')

  class Meta:
    db_table = 'api_user_permission'


class User(SerializableModel):
  email = models.EmailField(unique=True, blank=False, null=False)
  name = models.CharField(max_length=60, blank=False, null=False)
  date_joined = models.DateTimeField(auto_now_add=True)
  password = models.CharField(max_length=255, blank=False, null=False)
  group = models.ForeignKey(Group, related_name='users', related_query_name='user', db_column='group')
  token = models.CharField(max_length=255, unique=True, blank=True, null=True)
  is_active = models.BooleanField(default=False)

  def _should_hide(self, field_name: str) -> bool:
    return field_name == 'password' or field_name == 'token'

  @staticmethod
  def encrypt_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

  def is_password_matches(self, password: str) -> bool:
    return bcrypt.checkpw(password.encode(), self.password.encode())

  def generate_token(self) -> str:
    payload = {ID_FIELD: self.pk, NAME_FIELD: self.name, GROUP_FIELD: self.group.pk}
    return jwt.encode(payload, SECRET_KEY).decode()

  def generate_registration_token(self) -> str:
    payload = {ID_FIELD: self.pk}
    return jwt.encode(payload, SECRET_KEY).decode()

  def __str__(self):
    return self.email
