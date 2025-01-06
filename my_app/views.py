from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from .serializers import UserSerializer, AdminSerializer , SchemeSerializer
from django.contrib.auth.hashers import check_password 
from .models import User
from .models import  Admin
from .models import Scheme
from .models import UserApplications
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
import gridfs
from pymongo import MongoClient
import mimetypes
from PIL import Image
from io import BytesIO
from base64 import b64encode

mongo_client = MongoClient('mongodb+srv://shravanipatil1427:Shweta2509@cluster0.xwf6n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = mongo_client['Cluster0']
fs = GridFS(db)


class UserSchemeApplicationsView(APIView):
    def get(self, request, user_email):
        try:
            # Fetch all applications for the user by email
            applications = UserApplications.objects.filter(user_email=user_email)

            if not applications:
                return Response({"message": "No applications found for this user."}, status=status.HTTP_404_NOT_FOUND)

            # Prepare the list of applications to be returned
            application_data = []
            for app in applications:
                application_data.append({
                    "id": app.id,
                    "scheme_name": app.scheme_name,
                    "category": app.category,
                    "status": app.status,
                    "user_email": app.user_email,
                    "documents": app.documents,  # Assuming 'documents' field exists in UserApplications model
                })

            return Response({"applications": application_data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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




from base64 import b64encode
from bson.objectid import ObjectId
from rest_framework.response import Response
from rest_framework.views import APIView
import gridfs

class FetchDocumentsView(APIView):
    def get(self, request, application_id):
        try:
            application = get_object_or_404(UserApplications, id=application_id)
            documents_metadata = application.documents if application.documents else []

            documents = []
            for doc_meta in documents_metadata:
                file_id = doc_meta.get('file_id')
                try:
                    file_data = fs.get(ObjectId(file_id))
                    filename = file_data.filename.lower()

                    if not filename.endswith('.png'):
                        image = Image.open(file_data)
                        converted_image = BytesIO()
                        image.save(converted_image, format='PNG')
                        converted_image.seek(0)
                        documents.append({
                            'name': doc_meta.get('name'),
                            'content': b64encode(converted_image.read()).decode('utf-8'),
                            'content_type': 'image/png',
                        })
                    else:
                        base64_content = b64encode(file_data.read()).decode('utf-8')
                        documents.append({
                            'name': doc_meta.get('name'),
                            'content': base64_content,
                            'content_type': 'image/png',
                        })

                except gridfs.errors.NoFile:
                    documents.append({
                        'name': doc_meta.get('name'),
                        'error': f"File with id {file_id} not found in GridFS."
                    })

            return Response({
                'application_id': application_id,
                'user_email': application.user_email,
                'scheme_name': application.scheme_name,
                'documents': documents,
            }, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

class UserApplicationsView(APIView):
    def post(self, request):
        documents = []
        
        for key, value in request.data.items():
            if key.startswith('documents['):
                index = int(key.split('[')[1].split(']')[0])
                field = key.split('[')[2].split(']')[0]
                while len(documents) <= index:
                    documents.append({})
                documents[index][field] = value

        for key, value in request.FILES.items():
            if key.startswith('documents['):
                index = int(key.split('[')[1].split(']')[0])
                documents[index]['file'] = value

        mutable_data = request.data.dict()
        mutable_data['documents'] = documents

        serializer = UserApplicationsSerializer(data=mutable_data)
        if serializer.is_valid():
            application = serializer.save()
            return Response(UserApplicationsSerializer(application).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SchemeCreateView(APIView):
    def post(self, request):
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

            return JsonResponse({
                'message': 'Login successful',
                'data': user.email  
            }, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class AdminLoginView(APIView):
    def get(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
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
        
# class GetSchemesView(APIView):
#     def get(self, request):
#         print("Getting schemes")
#         schemes = Scheme.objects.all()
#         print("Schemes:", schemes)
#         serializer = SchemeSerializer(schemes, many=True)
#         return Response(serializer.data)
    
class GetSchemesView(APIView):
    from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Scheme
from .serializers import SchemeSerializer
from django.core.serializers.json import DjangoJSONEncoder
import json

class GetSchemesView(APIView):
    def get(self, request):
        try:
            print("Fetching schemes...")
            schemes = Scheme.objects.all()
            print("Serializing data...")
            serializer = SchemeSerializer(schemes, many=True)
            print(type(serializer.data))  # Should be <class 'rest_framework.utils.serializer_helpers.ReturnList'>
            print(serializer.data)  # Check the actual data

            print("Returning response...")
            # Explicitly serialize data to JSON if required
            response_data = json.dumps(serializer.data, cls=DjangoJSONEncoder)
            return Response(json.loads(response_data), status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
