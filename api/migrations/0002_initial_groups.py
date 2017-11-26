from __future__ import unicode_literals
from django.db import migrations


def create_groups(apps, schema_editor):
  Group = apps.get_model('api', 'Group')
  Group.objects.get_or_create(name='reader')
  Group.objects.get_or_create(name='manager')
  Group.objects.get_or_create(name='admin')


class Migration(migrations.Migration):
  dependencies = [('api', '0001_initial'), ]
  operations = [migrations.RunPython(create_groups)]
