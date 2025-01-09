from django.urls import path
from .views import SignupView, LoginView, AdminSignupView,UserProfileView,UserProfileEditView, UserAllView, UserCityView, UserPincodeView, UserStateView
from .views import SchemeCreateView
from .views import UserApplicationsView, FileDownloadView , applications_by_pincode, applications_by_category
from django.conf import settings
from django.conf.urls.static import static
from .views import FetchDocumentsView, UserSchemeApplicationsView, SchemeListView, GetPincode, UpdateRatingView, FetchUsersByPincodeView,admin_login

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('admin/signup/', AdminSignupView.as_view(), name='admin-signup'),
    path('admin/login/', admin_login, name='admin-login'),
    path('scheme/create/', SchemeCreateView.as_view(), name='scheme-create'),
    path('profile/<str:email>/', UserProfileView.as_view(), name='user-profile'),
    path('profile/<str:email>/edit/', UserProfileEditView.as_view(), name='user-profile-edit'),
    path('applications/', UserApplicationsView.as_view(), name='user-application'),
    path('download/<str:file_id>/', FileDownloadView.as_view(), name='file_download'),
    path('application-documents/<str:application_id>/', FetchDocumentsView.as_view(), name='fetch_application_documents'),
    path('applications/<str:user_email>/', UserSchemeApplicationsView.as_view(), name='user-applications'),
    path('schemes/', SchemeListView.as_view(), name='scheme-list'),
    path('get_user_count/', GetPincode.as_view(), name='get_user_count'),
    path('update-rating/', UpdateRatingView.as_view(), name='update_rating'),
    path('admin/<str:admin_email>/users/', FetchUsersByPincodeView.as_view(), name='fetch_users_by_pincode'),
    path('admin/<str:admin_email>/applications/', applications_by_pincode, name='applications_by_pincode'),
    path("get_user_count/", UserPincodeView.as_view(), name="user_count_by_pincode"),
    path("user_count_by_state/",  UserStateView.as_view(), name="user_count_by_state"),
    path("user_count_by_city/",  UserCityView.as_view(), name="user_count_by_city"),
    path("user_count_by_pincode/",  UserAllView.as_view(), name="user_count_by_pincode_all"),
    path('applications/by-category/', applications_by_category, name='applications_by_category'),
]
