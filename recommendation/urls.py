# urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('recommend/<str:email>/', views.GetRecommendation.as_view(), name='recommendations'),
]
