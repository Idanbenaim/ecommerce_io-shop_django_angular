# serializers.py
from rest_framework import serializers
from .models import AlbumRating, Artist, Genre, Album, Cart, CartItem, Order, OrderItem
import json

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
    artist = ArtistSerializer()
    artist_name = serializers.CharField(source='artist.artist_name')
    genre = serializers.CharField(source='genre.genre_name')
    songs_list = serializers.SerializerMethodField()
    # artist_name = serializers.SerializerMethodField()
   
    class Meta:
       model = Album
       fields = '__all__'

    def get_songs_list(self, obj):
        """This method will be used to get the songs list"""
        if isinstance(obj.songs_list, str):
            return obj.songs_list.split(', ')
        return []

#################### AlbumRating ####################
class AlbumRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlbumRating
        fields = '__all__'

#################### CartItem ####################
class CartItemSerializer(serializers.ModelSerializer):
    # album = serializers.IntegerField(write_only=True)
    # print(album)
    class Meta:
        model = CartItem
        fields = ['id','album', 'quantity']
        
#################### Cart ####################
class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True, source='items', required=False)  # Use 'items' related_name here

    class Meta:
        model = Cart
        fields = ['user', 'cart_items', 'id']

#################### OrderItem ####################
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
         model = OrderItem
         fields = '__all__'
         
#################### Order ####################
class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True, source='orderitem_set')

    class Meta:
        model = Order
        fields = '__all__'





    """
    Update a cart object.

    Args:
        instance: The cart object to update.
        validated_data: The validated JSON data.

    Returns:
        The updated cart object.
    """


