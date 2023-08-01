# models.py
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


# Create your models here.
class Artist(models.Model):
    artist_name = models.CharField(max_length=250)
    artist_bio = models.CharField(max_length=1000, blank=True, null=True)
    artist_image = models.ImageField(upload_to='static/images', blank=True, null=True)

    def __str__(self):
        return self.artist_name

class Genre(models.Model):
    genre_name = models.CharField(max_length=100)

    def __str__(self):
        return self.genre_name

class Album(models.Model):
    artist = models.ForeignKey(Artist,on_delete=models.CASCADE)
    genre = models.ForeignKey(Genre,on_delete=models.CASCADE)
    album_title = models.CharField(max_length=500)
    albumYear = models.IntegerField()  
    description = models.CharField(max_length=2500)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    yt_link = models.CharField(max_length=1000, blank=True, null=True)
    songs_list = models.CharField(max_length=1000, null=True)
    album_cover = models.ImageField(upload_to='static/images', blank=True, null=True)

    def __str__(self):
        return self.album_title
    
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE, null=True)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    
# class CartItem(models.Model):
#     album = models.ForeignKey('Album', on_delete=models.CASCADE)
#     quantity = models.PositiveIntegerField(default=1)

#     def __str__(self):
#         return str(self.id)

# class Cart(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE)
#     items = models.ManyToManyField('CartItem')

#     def __str__(self):
#         return str(self.id)

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE)
    firstName = models.CharField(max_length=35)
    lastName = models.CharField(max_length=35)
    email = models.EmailField(max_length=100, blank=False)
    addressLine1 = models.CharField(max_length=100, blank=True)
    addressLine2 = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=35)
    state = models.CharField(max_length=35)
    zipcode = models.CharField(max_length=35)
    transaction_id = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    payer_id = models.CharField(max_length=50)
    total_amount = models.DecimalField(max_digits=6, decimal_places=2)
    currency = models.CharField(max_length=3)

    def __str__(self):
        return f'Order #{self.id}'

class OrderItem(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    album = models.ForeignKey(Album,on_delete=models.CASCADE)
    qty = models.IntegerField()

    def __str__(self):
        return self.album.album_title


# class Cart(models.Model):
#     customer = models.ForeignKey(Customer,on_delete=models.CASCADE)
#     date_created = models.DateTimeField(auto_now_add=True)
#     totalAmount = models.DecimalField(max_digits=6, decimal_places=2)

#     def __str__(self):
#         return f'Cart #{self.id} by {self.customer.firstName} {self.customer.lastName}'

# class CartItem(models.Model):
#     cart = models.ForeignKey(Cart,on_delete=models.CASCADE)
#     album = models.ForeignKey(Album,on_delete=models.CASCADE)
#     qty = models.IntegerField()

#     def __str__(self):
#         return self.album.album_title

# class Customer(models.Model):
#     user =models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
#     firstName = models.CharField(max_length=35)
#     lastName = models.CharField(max_length=35)
#     email = models.EmailField(max_length=100, blank=False)
#     addressLine1 = models.CharField(max_length=100, blank=True)
#     addressLine2 = models.CharField(max_length=100, blank=True)
#     city = models.CharField(max_length=35)
#     state = models.CharField(max_length=35)
#     zipcode = models.CharField(max_length=35)

#     def __str__(self):
#        return self.firstName
    
# class Review(models.Model):
#     album = models.ForeignKey(Album,on_delete=models.CASCADE)
#     customer = models.ForeignKey(Customer,on_delete=models.CASCADE)
#     reviewDate = models.DateTimeField(auto_now_add=True)
#     reviewText = models.CharField(max_length=1000)

#     def __str__(self):
#         return self.album.album_title

# class Inventory(models.Model):
#     album = models.ForeignKey(Album,on_delete=models.CASCADE)
#     qty = models.IntegerField()

#     def __str__(self):
#         return self.album.album_title

