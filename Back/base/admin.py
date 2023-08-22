from django.contrib import admin
from .models import Artist, Genre, Album, Cart, CartItem, Order, OrderItem, AlbumRating

# Register your models here.

# admin.site.register(Customer)
admin.site.register(Artist)
admin.site.register(Genre)
admin.site.register(Album)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(AlbumRating)


