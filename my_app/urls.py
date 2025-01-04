from django.urls import path
from .views import SignupView, LoginView, AdminSignupView, AdminLoginView,UserProfileView,UserProfileEditView
from .views import SchemeCreateView
from .views import UserApplicationsView, FileDownloadView
from django.conf import settings
from django.conf.urls.static import static
from .views import FetchUserApplicationsView, FetchApplicationDocumentsView




# urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('admin/signup/', AdminSignupView.as_view(), name='admin-signup'),
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('scheme/create/', SchemeCreateView.as_view(), name='scheme-create'),
    path('profile/<str:email>/', UserProfileView.as_view(), name='user-profile'),
    path('profile/<str:email>/edit/', UserProfileEditView.as_view(), name='user-profile-edit'),
    path('applications/', UserApplicationsView.as_view(), name='user-application'),
    path('download/<str:file_id>/', FileDownloadView.as_view(), name='file_download'),
    path('applications/<str:user_email>/', FetchUserApplicationsView.as_view(), name='fetch_user_applications'),
    path('application-documents/<str:application_id>/', FetchApplicationDocumentsView.as_view(), name='fetch_application_documents'),




]
