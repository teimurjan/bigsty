from django.db import models

from api.models.base import BaseModel


class Group(BaseModel):
  name = models.CharField(max_length=60, unique=True, blank=False, null=False, primary_key=True)

  class Meta:
    db_table = 'api_user_group'


class Permission(BaseModel):
  name = models.CharField(max_length=60, unique=True, blank=False, null=False)
  groups = models.ManyToManyField(Group, related_name='permissions', related_query_name=' permission',
                                  db_table='api_user_permission_x_group')

  class Meta:
    db_table = 'api_user_permission'


class User(BaseModel):
  email = models.EmailField(unique=True, blank=False, null=False)
  name = models.CharField(max_length=60, blank=False, null=False)
  date_joined = models.DateTimeField(auto_now_add=True)
  password = models.CharField(max_length=255, blank=False, null=False)
  group = models.ForeignKey(Group, related_name='users', db_column='group')

  def to_dict(self, exclude=list(), relations=list(), **kwargs):
    exclude.append('password')
    return super().to_dict(exclude, relations)

  def _get_field(self, field_value):
    from datetime import datetime
    if isinstance(field_value, datetime):
      return field_value.__str__()
    return super()._get_field(field_value)

  def __str__(self):
    return self.email
