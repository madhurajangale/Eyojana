# urls.py

from django.urls import path
from . import views
from .views import UpdateRatingView
urlpatterns = [
    # path('recommend/<str:email>/', views.GetRecommendation.as_view(), name='recommendations'),
    path('update-rating/', UpdateRatingView.as_view(), name='update_rating'),
    path('create-rating/', views.CreateRatingView.as_view(), name='create-rating'),
]
