from django.urls import path
from .views import SignupView, LoginView, AdminSignupView, AdminLoginView
from .views import SchemeCreateView


urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('admin/signup/', AdminSignupView.as_view(), name='admin-signup'),
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
     path('scheme/create/', SchemeCreateView.as_view(), name='scheme-create'),
]
