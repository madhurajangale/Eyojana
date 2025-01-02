from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from .serializers import UserSerializer, AdminSerializer , SchemeSerializer
from django.contrib.auth.hashers import check_password 
from .models import User
from .models import  Admin
from .models import Scheme
from django.core.exceptions import ObjectDoesNotExist
from .models import UserApplication
from .serializers import ApplicationCreateSerializer, ApplicationRetrieveSerializer
from django.shortcuts import get_object_or_404

class UserApplicationView(APIView):
    def get(self, request):
        """Fetch all applications"""
        applications = UserApplication.objects.all()
        serializer = ApplicationRetrieveSerializer(applications, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Submit a new application with document upload"""
        serializer = ApplicationCreateSerializer(data=request.data)
        if serializer.is_valid():
            application = serializer.save()
            # Optional: Add documents to the application object
            application.documents = ["Document 1", "Document 2"]  # Replace with actual document processing logic
            application.save()
            response_serializer = ApplicationRetrieveSerializer(application)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserApplicationDetailView(APIView):
    def get(self, request, pk):
        """Retrieve a specific application"""
        application = get_object_or_404(UserApplication, pk=pk)
        serializer = ApplicationRetrieveSerializer(application)
        return Response(serializer.data)

    def put(self, request, pk):
        """Update an application"""
        application = get_object_or_404(UserApplication, pk=pk)
        serializer = ApplicationCreateSerializer(application, data=request.data, partial=True)
        if serializer.is_valid():
            application = serializer.save()
            response_serializer = ApplicationRetrieveSerializer(application)
            return Response(response_serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete an application"""
        application = get_object_or_404(UserApplication, pk=pk)
        application.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




class SchemeCreateView(APIView):
    def post(self, request):
        # Deserialize the incoming data using the SchemeSerializer
        serializer = SchemeSerializer(data=request.data)
        
        if serializer.is_valid():
            # Save the scheme and handle related operations
            scheme = serializer.save()
            return Response({
                'message': 'Scheme created successfully',
                'details': serializer.data
            }, status=status.HTTP_201_CREATED)
        else:
            # Return detailed errors if validation fails
            return Response({
                'message': 'Failed to create scheme',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

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

class LoginView(APIView):
    def get(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Authenticate the user
        user = authenticate(request, username=email, password=password)

        if user is not None:
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class AdminLoginView(APIView):
    def get(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Authenticate the admin using the custom backend
        admin = authenticate(request, username=email, password=password)

        if admin is not None:
            return Response({'message': 'Admin login successful'}, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)