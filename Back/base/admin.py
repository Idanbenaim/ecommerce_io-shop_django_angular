from django.contrib import admin
from .models import Customer, Artist, Genre, Album

# Register your models here.

admin.site.register(Customer)
admin.site.register(Artist)
admin.site.register(Genre)
admin.site.register(Album)

