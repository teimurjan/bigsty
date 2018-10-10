from django.db import models

from api.dto.group import GroupDTO


class Group(models.Model):
    name = models.CharField(max_length=60, unique=True,
                            blank=False, null=False)

    def to_dto(self):
        return GroupDTO(self.pk, self.name)

    class Meta:
        db_table = 'api_user_group'
