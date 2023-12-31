# Generated by Django 4.0.6 on 2023-06-17 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_album_artist_cart_genre_order_customer_email_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='address',
            field=models.CharField(default='123 Test St.', max_length=100),
        ),
        migrations.AddField(
            model_name='customer',
            name='city',
            field=models.CharField(default='Test city', max_length=35),
        ),
        migrations.AddField(
            model_name='customer',
            name='state',
            field=models.CharField(default='Test', max_length=35),
        ),
        migrations.AddField(
            model_name='customer',
            name='zipcode',
            field=models.CharField(default='123452', max_length=35),
        ),
        migrations.DeleteModel(
            name='ShippingAddress',
        ),
    ]
