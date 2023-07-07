from django.contrib import admin
from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [

    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.register),
    
    path('customers/<int:id>',views.manageCustomers.as_view()),
    path('customers/', views.manageCustomers.as_view()),
    
    path('artists/<int:id>',views.manageArtists.as_view()),
    path('artists/', views.manageArtists.as_view()),
    path('artists/<int:artist_id>/albums/', views.manageArtistAlbums.as_view()),
    
    path('genres/<int:id>',views.manageGenres.as_view()),
    path('genres/', views.manageGenres.as_view()),

    path('albums/<int:id>',views.manageAlbums.as_view()),
    path('albums/', views.manageAlbums.as_view()),

    path('cart/<int:id>',views.manageCarts.as_view()),
    path('cart/', views.manageCarts.as_view()),

]