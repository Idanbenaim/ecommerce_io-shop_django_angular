# Generated by Django 4.2.2 on 2023-09-16 09:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0023_alter_album_yt_link'),
    ]

    operations = [
        migrations.AlterField(
            model_name='album',
            name='yt_link',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]