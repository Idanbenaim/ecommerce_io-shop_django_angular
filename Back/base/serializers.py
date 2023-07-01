from rest_framework import serializers
from .models import Customer, Artist, Genre, Album, Cart, CartItem, Order, OrderItem, Payment, Review



#################### Customer ####################
class CustomerSerializer(serializers.ModelSerializer):
   class Meta:
       model = Customer
       fields = '__all__'

#################### Artist ####################
class ArtistSerializer(serializers.ModelSerializer):
   class Meta:
       model = Artist
       fields = '__all__'

#################### Genre ####################
class GenreSerializer(serializers.ModelSerializer):
   class Meta:
       model = Genre
       fields = '__all__'

#################### Album ####################
class AlbumSerializer(serializers.ModelSerializer): 
    artist_name = serializers.CharField(source='artist.artist_name')
    genre = serializers.CharField(source='genre.genre_name')
    songs_list = serializers.SerializerMethodField()
    # artist_name = serializers.SerializerMethodField()
   
    class Meta:
       model = Album
       fields = '__all__'

    # def get_artist_name(self, obj):  
    #     """This method will be used to get the artist name"""
    #     return obj.artist.artist_name  # Access the artist_name property of the related Artist object

    def get_songs_list(self, obj):
        """This method will be used to get the songs list"""
        if isinstance(obj.songs_list, str):
            return obj.songs_list.split(', ')
        return []

# #################### Inventory ####################
# class InventorySerializer(serializers.ModelSerializer):
#    class Meta:
#        model = Inventory
#        fields = '__all__'

# #################### Cart ####################
# class CartSerializer(serializers.ModelSerializer):
#     class Meta:
#          model = Cart
#          fields = '__all__'

# #################### CartItem ####################
# class CartItemSerializer(serializers.ModelSerializer):
#     class Meta:
#          model = CartItem
#          fields = '__all__'

# #################### Order ####################
# class OrderSerializer(serializers.ModelSerializer):
#     class Meta:
#          model = Order
#          fields = '__all__'

# #################### OrderItem ####################
# class OrderItemSerializer(serializers.ModelSerializer):
#     class Meta:
#          model = OrderItem
#          fields = '__all__'

# #################### Payment ####################
# class PaymentSerializer(serializers.ModelSerializer):
#     class Meta:
#          model = Payment
#          fields = '__all__'

# #################### Review ####################
# class ReviewSerializer(serializers.ModelSerializer):
#     class Meta:
#          model = Review
#          fields = '__all__'

