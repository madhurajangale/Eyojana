from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from .serializers import UserSerializer, AdminSerializer , SchemeSerializer
from django.contrib.auth.hashers import check_password 
from .models import User
from .models import  Admin
from .models import Scheme

class SchemeCreateView(APIView):
    def post(self, request):
        # Deserialize the incoming data using the SchemeSerializer
        serializer = SchemeSerializer(data=request.data)
        
        if serializer.is_valid():
            # If valid, save the data (it will also handle the documents creation)
            scheme = serializer.save()
            return Response({'message': 'Scheme created successfully', 'scheme_id': scheme.id}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
         serializer.save()
         return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            
        

class AdminSignupView(APIView):
    def post(self, request):
        serializer=AdminSerializer(data=request.data)
        if serializer.is_valid():
            admin=serializer.save()
            return Response({'message': 'Admin created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# Login View
class LoginView(APIView):
    def get(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Authenticate the user using the custom backend
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Successful authentication
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)

class AdminLoginView(APIView):
    def get(self, request):
        adminname = request.data.get('adminname')
        password = request.data.get('password')

        # Validate input
        if not adminname or not password:
            return Response({'error': 'Admin name and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Retrieve admin record
            admin = Admin.objects.get(adminname=adminname)
        except Admin.DoesNotExist:
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_404_NOT_FOUND)

        # Check password
        if check_password(password, admin.password):
            return Response({'message': 'Login successful.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)