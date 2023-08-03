# views.py
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.core.mail import send_mail

from rest_framework.response import Response
from rest_framework import serializers, status, viewsets, permissions, generics 
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes

from .serializers import ( ArtistSerializer, GenreSerializer, 
                        AlbumSerializer, CartSerializer,CartItemSerializer, OrderItemSerializer, OrderSerializer,) 
from .models import ( Artist, Genre, Album, Cart, CartItem, Order, OrderItem,)

# get the user id
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_id(request):
    user_id = request.user.id
    return Response({'user_id': user_id})

# register new user
@api_view(['POST'])
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

    user = User.objects.create_user(username=username, password=password)
    user.is_active = True
    user.is_staff = False
    user.is_superuser = False
    user.save()

    # Send confirmation email
    send_mail(
        'Hello from ioRecords',  # subject
        'Thank you for registering!',  # message
        'iorecords0@gmail.com',  # from email
        [user.username],  # recipient list
        fail_silently=False,
    )

    return Response({'message': 'User created successfully.'}, status=201)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['user_id'] = user.id
        # ...
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    # def create(self, validated_data):
    #     user = self.context['user']
    #     print(user)
    #     return Customer.objects.create(**validated_data,user=user)


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
        # elif artist_id > -1:
        #     my_model = Album.objects.filter(artist__id=artist_id)
        #     serializer = AlbumSerializer(my_model, many=True)
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

#################### Cart ####################
class manageCarts(APIView):
    def get(self, request, id=-1):  # axios.get
        if id > -1:
            my_model = Cart.objects.get(id=id)
            serializer = CartSerializer(my_model, many=False)
        else:
            my_model = Cart.objects.all()
            serializer = CartSerializer(my_model, many=True)
        return Response(serializer.data)

    def post(self, request):  # axios.post
        serializer = CartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):  # axios.put
        print(self, request, id)
        my_model = Cart.objects.get(id=id)
        print(my_model)
        serializer = CartSerializer(my_model, data=request.data)
        print(serializer.is_valid())
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            updated_cart_data = serializer.data  # This will contain the updated data
            print(updated_cart_data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):  # axios.delete
        my_model = Cart.objects.get(id=id)
        my_model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#################### Cart-item ####################
class manageCartItems(APIView):
    def get(self, request):  # axios.get
        carts = Cart.objects.all()
        serializer = CartSerializer(carts, many=True)
        return Response(serializer.data)

    def post(self, request):  # axios.post
        serializer = CartItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def put(self, request, id=None):  # axios.put
    #     try:
    #         cart = Cart.objects.get(id=id)
    #     except Cart.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)

    #     serializer = CartSerializer(cart, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_200_OK)
    #     print(serializer.errors)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, id):  # axios.put
        print(self, request.data, id)
        my_model = CartItem.objects.get(id=id)
        serializer = CartItemSerializer(my_model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):  # axios.delete
        my_model = CartItem.objects.get(id=id)
        my_model.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#################### Order ####################
class manageOrders(APIView):
    def get(self, request, id=-1):  # axios.get
        if id > -1:
            my_model = Order.objects.get(id=id)
            serializer = OrderSerializer(my_model, many=False)
        else:
            my_model = Order.objects.all()
            serializer = OrderSerializer(my_model, many=True)
        return Response(serializer.data)


    def post(self, request):  # axios.post
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
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
        

#################### Customer ####################
# class manageCustomers(APIView):
#     def get(self, request, id=-1):  # axios.get
#         if id > -1:
#             my_model = Customer.objects.get(id=id)
#             serializer = CustomerSerializer(my_model, many=False)
#         else:
#             my_model = Customer.objects.all()
#             serializer = CustomerSerializer(my_model, many=True)
#         return Response(serializer.data)


#     def post(self, request):  # axios.post
#         serializer = CustomerSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#     def put(self, request, id):  # axios.put
#         my_model = Customer.objects.get(id=id)
#         serializer = CustomerSerializer(my_model, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#     def delete(self, request, id):  # axios.delete
#         my_model = Customer.objects.get(id=id)
#         my_model.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


####CART#####
    # def get(self, request, id=-1):  # axios.get
    #     if id > -1:
    #         my_model = CartItem.objects.get(id=id)
    #         serializer = CartItemSerializer(my_model, many=False)
    #     else:
    #         my_model = CartItem.objects.all()
    #         serializer = CartItemSerializer(my_model, many=True)
    #     return Response(serializer.data)

    # def get(self, request, id=-1):  # axios.get
    #     if id > -1:
    #         try:
    #             my_model = Cart.objects.get(id=id)
    #             serializer = CartSerializer(my_model)
    #         except Cart.DoesNotExist:
    #             return Response({"error": "Cart not found."}, status=status.HTTP_404_NOT_FOUND)
    #     else:
    #         my_model = Cart.objects.all()
    #         serializer = CartSerializer(my_model, many=True)
    #     return Response(serializer.data)