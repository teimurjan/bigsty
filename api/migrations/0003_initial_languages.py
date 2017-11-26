from __future__ import unicode_literals
from django.db import migrations


def create_groups(apps, schema_editor):
  Language = apps.get_model('api', 'Language')
  Language.objects.get_or_create(name='en')


class Migration(migrations.Migration):
  dependencies = [('api', '0001_initial'), ]
  operations = [migrations.RunPython(create_groups)]
