# views.py
from http.client import NOT_FOUND
from xml.dom import NOT_FOUND_ERR, NotFoundErr
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import transaction


from rest_framework.response import Response
from rest_framework import serializers, status, viewsets, permissions, generics 
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound

from .serializers import ( ArtistSerializer, GenreSerializer, 
                        AlbumSerializer, CartSerializer,CartItemSerializer, OrderItemSerializer, OrderSerializer,) 
from .models import ( AlbumRating, Artist, Genre, Album, Cart, CartItem, Order, OrderItem,)

# register new user
@api_view(['POST'])
@transaction.atomic
def register(request):
    username = request.data['username']
    password = request.data['password']

    # Validate email
    try:
        validate_email(username)
    except ValidationError:
        return Response({'message': 'Invalid email format.'}, status=400)

    # Check if the user already exists
    if User.objects.filter(username=username).exists():
        return Response({'message': 'Username already exists.'}, status=400)

    with transaction.atomic():
        user = User.objects.create_user(username=username, password=password)
        user.is_active = True
        user.is_staff = False
        user.is_superuser = False
        user.save()

        # Create a cart for the user
        cart = Cart.objects.create(user=user)
        cart.save()

    return Response({'message': 'User created successfully.'}, status=201)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['user_id'] = user.id
        token['cart_id'] = user.cart.id
        # ...
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Create your views here.
#################### Artist ####################
class manageArtists(APIView):
    def get(self, request, id=-1):  # axios.get
        if id > -1:
            my_model = Artist.objects.get(id=id)
            serializer = ArtistSerializer(my_model, many=False)
        else:
            my_model = Artist.objects.all()
            serializer = ArtistSerializer(my_model, many=True)
        return Response(serializer.data)


    def post(self, request):  # axios.post
        serializer = ArtistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, id):  # axios.put
        my_model = Artist.objects.get(id=id)
        serializer = ArtistSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, id):  # axios.delete
        my_model = Artist.objects.get(id=id)
        my_model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#################### manage the albums of a specific artist ####################
class manageArtistAlbums(APIView):
    def get(self, request, artist_id):  # axios.get
        artist = get_object_or_404(Artist, pk=artist_id)
        albums = Album.objects.filter(artist=artist)
        serializer = AlbumSerializer(albums, many=True)
        return Response(serializer.data)

#################### Genre ####################
class manageGenres(APIView):
    def get(self, request, id=-1):  # axios.get
        if id > -1:
            my_model = Genre.objects.get(id=id)
            serializer = GenreSerializer(my_model, many=False)
        else:
            my_model = Genre.objects.all()
            serializer = GenreSerializer(my_model, many=True)
        return Response(serializer.data)


    def post(self, request):  # axios.post
        serializer = GenreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, id):  # axios.put
        my_model = Genre.objects.get(id=id)
        serializer = GenreSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, id):  # axios.delete
        my_model = Genre.objects.get(id=id)
        my_model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#################### Album ####################
class manageAlbums(APIView):
    def get(self, request, id=-1):  # axios.get
        if id > -1:
            my_model = Album.objects.get(id=id)
            serializer = AlbumSerializer(my_model, many=False)

        else:
            my_model = Album.objects.all()
            serializer = AlbumSerializer(my_model, many=True)
        return Response(serializer.data)


    def post(self, request):  # axios.post
        serializer = AlbumSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, id):  # axios.put
        my_model = Album.objects.get(id=id)
        serializer = AlbumSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, id):  # axios.delete
        my_model = Album.objects.get(id=id)
        my_model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#################### Album Rating #############
@permission_classes([IsAuthenticated])
class manageAlbumRatings(APIView):
    def get(self, request, album_id):
        album_ratings = AlbumRating.objects.filter(album_id=album_id)
        up_votes = album_ratings.filter(vote=1).count()
        down_votes = album_ratings.filter(vote=-1).count()

        return Response({
            'up_votes': up_votes,
            'down_votes': down_votes,
            'total_votes': up_votes + down_votes
        })
    
    def post(self, request):
        album_id = request.data.get('album')
        vote = request.data.get('vote')
        user = request.user

        # Ensure user has not voted before
        existing_rating = AlbumRating.objects.filter(album_id=album_id, user=user).first()
        if existing_rating:
            return Response({'error': 'You have already voted for this album.'}, status=400)

        # Create a new rating
        album_rating = AlbumRating(album_id=album_id, user=user, vote=vote)
        album_rating.save()

        return Response({'message': 'Vote submitted successfully.'})
    
#################### Cart ####################
@permission_classes([IsAuthenticated])
class manageCarts(APIView):
    def get(self, request, id=-1):
        # print(self, request, id)
        user_id = request.user.id  # Get the user ID from the request
        # print("request:", request, user_id)
        if id > -1:
            try:
                my_model = get_object_or_404(Cart, id=id, user=user_id)
            except Cart.DoesNotExist:
                raise NotFoundErr("Cart not found")
        else:
            # If the cart ID is not specified, retrieve all carts for the current user
            my_model = Cart.objects.filter(user=user_id)

        serializer = CartSerializer(my_model, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        try:
            user = request.user
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CartSerializer(data=request.data)
        if serializer.is_valid():
            cart = serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        print("PUT START !!!!!!!!!!!", self, request.data, id)
        try:
            cart = Cart.objects.get(id=id, user=request.user.id)
            print("line 229: ", cart)
        except Cart.DoesNotExist:
            raise NotFoundErr("Cart not found, or you don't have permission to access it")

        cart_items_data = request.data.get('cart_items')
        print("line 234: ", cart_items_data)
        if not cart_items_data:
            return Response({"error": "No cart items provided"}, status=status.HTTP_400_BAD_REQUEST)

        for item_data in cart_items_data:
            item_id = item_data.get('id')
            quantity = item_data.get('quantity')
            print("line 241: ","item_id: ", item_id, "quantity: ", quantity)

            if item_id:  # Existing cart item, update its quantity or remove if quantity is 0
                try:
                    cart_item = CartItem.objects.get(id=item_id, cart=cart)
                    if quantity is not None:
                        cart_item.quantity = quantity
                        if quantity == 0:
                            cart_item.delete()  # Remove the cart item if quantity is 0
                        else:
                            cart_item.save()
                    else:
                        cart_item.delete()  # Remove the cart item if quantity is not provided
                except CartItem.DoesNotExist:
                    return Response({"error": f"Cart item with ID {item_id} not found in the cart"},
                                        status=status.HTTP_404_NOT_FOUND)
            else:  # New cart item, create it
                album_id = item_data.get('album')
                if album_id is None:
                    return Response({"error": "Missing album ID in cart_items"}, status=status.HTTP_400_BAD_REQUEST)

                album = Album.objects.get(id=album_id)
                if quantity is not None:
                    if quantity > 0:
                        CartItem.objects.create(cart=cart, album=album, quantity=quantity)
                    else:
                        return Response({"error": "Quantity must be greater than 0"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    CartItem.objects.create(cart=cart, album=album, quantity=1)

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, cart_id, item_id):
        try:
            cart = Cart.objects.get(id=cart_id, user=request.user.id)
        except Cart.DoesNotExist:
            raise NotFoundErr("Cart not found, or you don't have permission to access it")

        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.delete()
        except CartItem.DoesNotExist:
            return Response({"error": f"Cart item with ID {item_id} not found in the cart"},
                            status=status.HTTP_404_NOT_FOUND)

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)   

#################### Order ####################
@permission_classes([IsAuthenticated])
class manageOrders(APIView):
    def get(self, request, id=-1):  
        user_id = request.user.id
        
        if id > -1:
            my_model = Order.objects.get(id=id, user=user_id)
            serializer = OrderSerializer(my_model)
        else:
            my_model = Order.objects.filter(user=user_id)
            serializer = OrderSerializer(my_model, many=True)
        
        return Response(serializer.data)

    def post(self, request):  # axios.post
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()  # Save the order instance to get its ID
            cart_items = CartItem.objects.filter(cart__user=request.user)  # Retrieve cart items for the user
            order_items = []
            for cart_item in cart_items:
                order_item = OrderItem(order=order, album=cart_item.album, qty=cart_item.quantity)
                order_items.append(order_item)
            OrderItem.objects.bulk_create(order_items)  # Bulk create order items from cart items
            cart_items.delete()  # Delete cart items after creating order items
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def put(self, request, id):  # axios.put
        my_model = Order.objects.get(id=id)
        serializer = OrderSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, id):  # axios.delete
        my_model = Order.objects.get(id=id)
        my_model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#################### Order Item ####################
class manageOrderItems(APIView):
    def get(self, request, id=-1):  # axios.get
        if id > -1:
            my_model = OrderItem.objects.get(id=id)
            serializer = OrderItemSerializer(my_model, many=False)
        else:
            my_model = OrderItem.objects.all()
            serializer = OrderItemSerializer(my_model, many=True)
        return Response(serializer.data)

    def post(self, request):  # axios.post
        serializer = OrderItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):  # axios.put
        my_model = OrderItem.objects.get(id=id)
        serializer = OrderItemSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):  # axios.delete
        my_model = OrderItem.objects.get(id=id)
        my_model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        