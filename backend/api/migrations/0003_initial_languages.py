from django.db import migrations


def create_languages(apps, schema_editor):
    m = apps.get_model('api', 'Language')
    m.objects.get_or_create(pk=1, name='en-US')


class Migration(migrations.Migration):
    dependencies = [('api', '0001_initial'), ]
    operations = [migrations.RunPython(create_languages)]
