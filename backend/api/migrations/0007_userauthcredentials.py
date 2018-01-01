# Generated by Django 2.0 on 2017-12-31 09:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_remove_user_token'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserAuthCredentials',
            fields=[
                ('jti', models.UUIDField(auto_created=True, editable=False, primary_key=True, serialize=False)),
                ('client_id', models.IntegerField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.User')),
            ],
            options={
                'db_table': 'api_user_auth_credentials',
            },
        ),
    ]
