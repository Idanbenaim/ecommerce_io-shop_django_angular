# urls.py
from django.contrib import admin
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [

    ####  AUTHENTICATION ####
    path('auth/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.register, name='register'),
    # path('logout/', views.logout, name='logout'),
    # path('get_user_id/', views.get_user_id, name='get_user_id'),  # get the user id from the token
    
    ####  ARTIST ####
    path('artists/<int:id>',views.manageArtists.as_view()),
    path('artists/', views.manageArtists.as_view()),
    path('artists/<int:artist_id>/albums/', views.manageArtistAlbums.as_view()),
    
    ####  GENRE ####
    path('genres/<int:id>',views.manageGenres.as_view()),
    path('genres/', views.manageGenres.as_view()),

    ####  ALBUM ####
    path('albums/<int:id>',views.manageAlbums.as_view()),
    path('albums/', views.manageAlbums.as_view()),

    ####  CART ####
    path('cart/', views.manageCarts.as_view()), # URL for getting all carts or creating a new cart
    path('cart/<int:id>/', views.manageCarts.as_view()), # URL with cart id for getting, updating, or deleting a specific cart by ID
    path('cart/<int:cart_id>/<int:item_id>/', views.manageCarts.as_view()),


    ####  ORDER ####
    path('orders/', views.manageOrders.as_view()),
    path('orders/<int:id>/', views.manageOrders.as_view()),
    path('orderitems/', views.manageOrderItems.as_view()),
    path('orderitems/<int:id>/', views.manageOrderItems.as_view()),

    ####  RATINGS ####
    path('create_album_rating/', views.manageAlbumRatings.as_view()),
    path('get_album_ratings/<int:album_id>/', views.manageAlbumRatings.as_view()),
    # path('ratings/<int:album_id>/', views.manageAlbumRatings.as_view()),
    # path('ratings/<int:album_id>/<int:user_id>/', views.manageAlbumRatings.as_view()),

]


    # path('customers/<int:id>',views.manageCustomers.as_view()),
    # path('customers/', views.manageCustomers.as_view()),

    # path('cart-item/', views.manageCartItems.as_view(), name='cart_items'), # URL for getting all cart items or creating a new cart item
    # path('cart-item/<int:id>/', views.manageCartItems.as_view(), name='cart_item'), # URL for getting, updating, or deleting a specific cart item by ID
