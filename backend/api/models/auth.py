import datetime

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


class User(SerializableModel):
  email = models.EmailField(unique=True, blank=False, null=False)
  name = models.CharField(max_length=60, blank=False, null=False)
  date_joined = models.DateTimeField(auto_now_add=True)
  password = models.CharField(max_length=255, blank=False, null=False)
  group = models.ForeignKey(Group, related_name='users', related_query_name='user', db_column='group')
  is_active = models.BooleanField(default=False)

  def _should_hide(self, field_name: str) -> bool:
    return field_name == 'password'

  @staticmethod
  def encrypt_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt())

  def is_password_matches(self, password: str) -> bool:
    return bcrypt.checkpw(password.encode(), self.password.encode())

  def generate_access_token(self) -> str:
    exp_date = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    payload = {ID_FIELD: self.pk, GROUP_FIELD: self.group.pk, "exp": exp_date}
    return jwt.encode(payload, SECRET_KEY).decode()

  def generate_refresh_token(self) -> str:
    exp_date = datetime.datetime.utcnow() + datetime.timedelta(hours=12)
    payload = {ID_FIELD: self.pk, "exp": exp_date}
    return jwt.encode(payload, SECRET_KEY).decode()

  def generate_registration_token(self) -> str:
    exp_date = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    payload = {ID_FIELD: self.pk, "exp": exp_date}
    return jwt.encode(payload, SECRET_KEY).decode()

  def __str__(self):
    return self.email
