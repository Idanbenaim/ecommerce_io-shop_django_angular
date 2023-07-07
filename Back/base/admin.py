from django.contrib import admin
from .models import Customer, Artist, Genre, Album, Cart, CartItem

# Register your models here.

admin.site.register(Customer)
admin.site.register(Artist)
admin.site.register(Genre)
admin.site.register(Album)
admin.site.register(Cart)
admin.site.register(CartItem)

