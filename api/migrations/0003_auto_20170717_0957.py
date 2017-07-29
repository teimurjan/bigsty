# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2017-07-17 09:57
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20170623_0220'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='modification',
        ),
        migrations.AlterField(
            model_name='featurevalue',
            name='feature_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='feature_type', to='api.FeatureType'),
        ),
        migrations.AlterField(
            model_name='product',
            name='product_type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='products', related_query_name='product', to='api.ProductType'),
        ),
        migrations.AlterField(
            model_name='productimage',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product', to='api.Product'),
        ),
        migrations.AlterField(
            model_name='producttype',
            name='image',
            field=models.FileField(blank=True, null=True, upload_to='store/static/images/products/main/'),
        ),
        migrations.AlterField(
            model_name='user',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='group', to='api.Group'),
        ),
    ]
