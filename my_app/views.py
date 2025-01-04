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
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .serializers import UserProfileSerializer 
from .serializers import UserApplicationsSerializer
from django.http import FileResponse, Http404
from gridfs import GridFS
from django.http import HttpResponse
from bson.objectid import ObjectId
from pymongo import MongoClient
from gridfs import GridFS

mongo_client = MongoClient('mongodb+srv://shravanipatil1427:Shweta2509@cluster0.xwf6n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = mongo_client['Cluster0']
fs = GridFS(db)

import gridfs
from pymongo import MongoClient
from bson.objectid import ObjectId
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import mimetypes

from PIL import Image
from io import BytesIO
from django.http import HttpResponse

class FileDownloadView(APIView):
    def get(self, request, file_id):
        try:
            # Fetch file metadata and chunks from GridFS
            file = fs.get(ObjectId(file_id))

            # Convert to PNG if the file does not already have a .png extension
            filename = file.filename.lower()
            if not filename.endswith('.png'):
                # Open the file as an image
                image = Image.open(file)

                # Convert the image to PNG format
                converted_image = BytesIO()
                image.save(converted_image, format='PNG')
                converted_image.seek(0)

                # Return the converted image for rendering in the frontend
                return HttpResponse(
                    converted_image,
                    content_type="image/png"
                )

            # If the file is already a PNG, return it directly
            return HttpResponse(file, content_type="image/png")

        except gridfs.errors.NoFile:
            # Handle missing file error
            return Response({"error": "File not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Handle any unexpected errors
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class FileDownloadView(APIView):
#     def get(self, request, file_id):
#         try:
#             # Fetch file metadata and chunks from GridFS
#             file = fs.get(ObjectId(file_id))

#             # Guess content type based on file extension or default to binary stream
#             content_type, _ = mimetypes.guess_type(file.filename)
#             content_type = content_type or "application/octet-stream"

#             # Return the file as an HTTP response
#             response = HttpResponse(file, content_type=content_type)
#             response['Content-Disposition'] = f'inline; filename="{file.filename}"'
#             return response

#         except gridfs.errors.NoFile:
#             # Handle missing file error
#             return Response({"error": "File not found."}, status=status.HTTP_404_NOT_FOUND)
       
# class FileDownloadView(APIView):
#     def get(self, request, file_id):
#         try:
#             # Fetch file metadata and chunks from GridFS
#             file = fs.get(ObjectId(file_id))

#             # Check file extension for allowed types
#             allowed_extensions = {'.png', '.jpeg', '.jpg'}
#             filename = file.filename.lower()

#             # Validate if the file has an allowed extension
#             if not any(filename.endswith(ext) for ext in allowed_extensions):
#                 return Response(
#                     {"error": "File type not allowed. Only .png, .jpeg, and .jpg are supported."},
#                     status=status.HTTP_400_BAD_REQUEST,
#                 )

#             # Guess content type based on file extension or default to binary stream
#             content_type, _ = mimetypes.guess_type(file.filename)
#             content_type = content_type or "application/octet-stream"

#             # Return the file as an HTTP response
#             response = HttpResponse(file, content_type=content_type)
#             response['Content-Disposition'] = f'inline; filename="{file.filename}"'
#             return response

#         except gridfs.errors.NoFile:
#             # Handle missing file error
#             return Response({"error": "File not found."}, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             # Handle any unexpected errors
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class FetchApplicationDocumentsView(APIView):
    def get(self, request, application_id):
        try:
            application = UserApplications.objects.get(id=application_id)
            documents = []

            for doc_meta in application.documents:
                file_id = doc_meta.get("file_id")
                file = fs.get(ObjectId(file_id))
                documents.append({
                    "name": doc_meta.get("name"),
                    "filename": file.filename,
                    "size": file.length,
                    "content_type": file.content_type,
                })

            return Response({"documents": documents}, status=status.HTTP_200_OK)

        except UserApplications.DoesNotExist:
            return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class FetchUserApplicationsView(APIView):
    def get(self, request, user_email):
        try:
            applications = UserApplications.objects.filter(user_email=user_email)
            if not applications.exists():
                return Response({"error": "No applications found for this user."}, status=status.HTTP_404_NOT_FOUND)

            serialized_apps = ApplicationSerializer(applications, many=True).data
            return Response({"applications": serialized_apps}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# class FileDownloadView(APIView):
#     def get(self, request, file_id):
#         try:
#             # Fetch file from GridFS
#             file = fs.get(ObjectId(file_id))
            
#             # Determine content type based on file extension
#             if file.filename.endswith(".png"):
#                 content_type = "image/png"
#             elif file.filename.endswith(".jpeg") or file.filename.endswith(".jpg"):
#                 content_type = "image/jpeg"
#             elif file.filename.endswith(".pdf"):
#                 content_type = "application/pdf"
#             else:
#                 content_type = "application/octet-stream"  

#             # Prepare the response with inline disposition
#             response = HttpResponse(file.read(), content_type=content_type)
#             response['Content-Disposition'] = f'inline; filename="{file.filename}"'  # Inline ensures it's viewable
#             return response

#         except Exception as e:
#             # Handle file not found or other exceptions
#             return Response({"error": "File not found or cannot be retrieved."}, status=status.HTTP_404_NOT_FOUND)
class UserApplicationsView(APIView):
    def post(self, request):
        documents = []
        
        # Parse documents data from the request
        for key, value in request.data.items():
            if key.startswith('documents['):
                # Extract index and field name
                index = int(key.split('[')[1].split(']')[0])
                field = key.split('[')[2].split(']')[0]
                # Ensure the list has enough space
                while len(documents) <= index:
                    documents.append({})
                # Add field data
                documents[index][field] = value

        # Attach files to the appropriate documents
        for key, value in request.FILES.items():
            if key.startswith('documents['):
                index = int(key.split('[')[1].split(']')[0])
                documents[index]['file'] = value

        # Add documents back into request data
        mutable_data = request.data.dict()
        mutable_data['documents'] = documents

        # Serialize and save
        serializer = UserApplicationsSerializer(data=mutable_data)
        if serializer.is_valid():
            application = serializer.save()
            return Response(UserApplicationsSerializer(application).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Authenticate the user
        user = authenticate(request, username=email, password=password)

        if user is not None:
            serializer = UserSerializer(user)

            # Return the response with user data
            return JsonResponse({
                'message': 'Login successful',
                'data': user.email  # Include serialized user data
            }, status=status.HTTP_200_OK)
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
    
class UserProfileView(APIView):
    def get(self, request, email):
        try:
            # Query the user from the database using the email
            user = User.objects.get(email=email)
            
            # Return user data as JSON
            return JsonResponse({
                'status': 'success',
                'message': f'Profile found for {email}',
                'data': {
                    'username': user.username,
                    'email': user.email,
                    'phone_number': user.phone_number,
                    'income': user.income,
                    'age': user.age,
                    'pincode': user.pincode,
                    'city': user.city,
                    'district': user.district,
                    'state': user.state,
                    'gender': user.gender,
                    'caste': user.caste,
                    'employment_status': user.employment_status,
                    'marital_status': user.marital_status,
                }
            })
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found.'})
        

class UserProfileEditView(APIView):
    def patch(self, request, email):
        try:
            # Fetch the user by email
            user = User.objects.get(email=email)
            
            # Use the serializer to validate and update the user's data
            serializer = UserProfileSerializer(user, data=request.data, partial=True)  # partial=True for partial updates
            
            if serializer.is_valid():
                serializer.save()  # Save the updated data
                return JsonResponse({
                    'status': 'success',
                    'message': 'Profile updated successfully.',
                    'data': serializer.data
                })
            return JsonResponse({'status': 'error', 'message': 'Invalid data.', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        except User.DoesNotExist:
            raise NotFound(detail="User not found.", code=status.HTTP_404_NOT_FOUND) 