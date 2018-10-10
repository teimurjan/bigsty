from django.db import migrations


def create_groups(apps, schema_editor):
    m = apps.get_model('api', 'Group')
    m.objects.get_or_create(pk=1, name='reader')
    m.objects.get_or_create(pk=2, name='manager')
    m.objects.get_or_create(pk=3, name='admin')


class Migration(migrations.Migration):
    dependencies = [('api', '0001_initial'), ]
    operations = [migrations.RunPython(create_groups)]
