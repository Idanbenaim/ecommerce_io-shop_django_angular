from django.db import models
from django.contrib.auth.models import User


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


class Inventory(models.Model):
    album = models.ForeignKey(Album,on_delete=models.CASCADE)
    qty = models.IntegerField()

    def __str__(self):
        return self.album.album_title


class Customer(models.Model):
    user =models.ForeignKey(User,on_delete=models.SET_NULL,null=True)
    firstName = models.CharField(max_length=35)
    lastName = models.CharField(max_length=35)
    custPhone = models.CharField(max_length=16)
    email = models.EmailField(max_length=100, blank=False)
    address = models.CharField(max_length=100, blank=False)
    city = models.CharField(max_length=35)
    state = models.CharField(max_length=35)
    zipcode = models.CharField(max_length=35)
        # order = models.ForeignKey(Order,on_delete=models.CASCADE)

    def __str__(self):
       return self.firstName


class Cart(models.Model):
    customer = models.ForeignKey(Customer,on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    totalAmount = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f'Cart #{self.id} by {self.customer.firstName} {self.customer.lastName}'


class CartItem(models.Model):
    cart = models.ForeignKey(Cart,on_delete=models.CASCADE)
    album = models.ForeignKey(Album,on_delete=models.CASCADE)
    qty = models.IntegerField()

    def __str__(self):
        return self.album.album_title

class Order(models.Model):
    customer = models.ForeignKey(Customer,on_delete=models.CASCADE)
    orderDate = models.DateTimeField(auto_now_add=True)
    totalAmount = models.DecimalField(max_digits=5, decimal_places=2)
    cart = models.ForeignKey(Cart,on_delete=models.CASCADE)
    paypalOrderID = models.CharField(max_length=100)

    # def __str__(self):
    #     return self.customer.firstName

    def __str__(self):
        return f'Order #{self.id} by {self.customer.firstName} {self.customer.lastName}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    album = models.ForeignKey(Album,on_delete=models.CASCADE)
    qty = models.IntegerField()

    def __str__(self):
        return self.album.album_title


class Payment(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    paymentDate = models.DateTimeField(auto_now_add=True)
    paymentMethod = models.CharField(max_length=35)
    amount = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.paymentMethod

class Review(models.Model):
    album = models.ForeignKey(Album,on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer,on_delete=models.CASCADE)
    reviewDate = models.DateTimeField(auto_now_add=True)
    reviewText = models.CharField(max_length=1000)

    def __str__(self):
        return self.album.album_title


# class ShippingAddress(models.Model):
#     order = models.ForeignKey(Order,on_delete=models.CASCADE)
#     address = models.CharField(max_length=100)
#     city = models.CharField(max_length=35)
#     state = models.CharField(max_length=35)
#     zipcode = models.CharField(max_length=35)

#     def __str__(self):
#         return self.address