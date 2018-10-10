from django.db import models

from api.dto.user import UserDTO
from api.models.group import Group


class User(models.Model):
    email = models.EmailField(unique=True, blank=False, null=False)
    name = models.CharField(max_length=60, blank=False, null=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    password = models.CharField(max_length=255, blank=False, null=False)
    group = models.ForeignKey(Group, related_name='users', related_query_name='user',
                              db_column='group', on_delete=models.CASCADE, default=1)
    is_active = models.BooleanField(default=False)

    def to_dto(self):
        return UserDTO(self.id, self.email, self.name, self.date_joined,
                       self.password, self.group.to_dto(), self.is_active)

    class Meta:
        db_table = 'api_user'
