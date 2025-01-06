from rest_framework import serializers
from .models import User, Admin, Scheme
from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from .models import UserApplications
from django.core.exceptions import ValidationError
from pymongo import MongoClient
from gridfs import GridFS
from bson import ObjectId
from my_app.models import UserRating
client = MongoClient('mongodb+srv://shravanipatil1427:Shweta2509@cluster0.xwf6n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['Cluster0']
fs = GridFS(db)


class DocumentSerializer1(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    content = serializers.CharField()  # Base64 encoded file content

class UserApplicationsDocumentSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer1(many=True, read_only=True)

    class Meta:
        model = UserApplications
        fields = ['id', 'user_email', 'scheme_name', 'category', 'status', 'applied_date', 'documents']

# class DocumentSerializer(serializers.Serializer):
#     document_id = serializers.CharField()
#     filename = serializers.CharField()
#     content_type = serializers.CharField()
#     size = serializers.IntegerField()

#     def to_representation(self, instance):
#         # Fetch file metadata from GridFS
#         file = fs.get(instance)
#         return {
#             'document_id': str(file._id),
#             'filename': file.filename,
#             'content_type': file.content_type,
#             'size': file.length
#         }

class DocumentSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    file = serializers.FileField()

    def create(self, validated_data):
        """
        Custom document processing (if required).
        """
        return validated_data

class UserApplicationsSerializer(serializers.ModelSerializer):
    documents = serializers.ListField(
        child=DocumentSerializer(),
        write_only=True,
        required=False
    )

    class Meta:
        model = UserApplications
        fields = ['id', 'user_email', 'scheme_name', 'category', 'status', 'applied_date', 'documents']

    def create(self, validated_data):
        documents = validated_data.pop('documents', [])
        application = UserApplications.objects.create(**validated_data)

        # Handle document uploads
        for document in documents:
            file = document.get('file')  # Extract file
            filename = document.get('name')  # Extract filename
            file_id = fs.put(file, filename=filename)  # Save file in GridFS
            application.add_document(name=filename, file_id=file_id)

        return application

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'phone_number', 'income', 'age', 'pincode', 'city', 'district', 'state', 'gender', 'caste', 'employment_status', 'marital_status']
        # You can add the 'read_only_fields' option if you want to restrict certain fields from being updated
        read_only_fields = ['email']  # Prevent updating email since it is unique

class SchemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scheme
        fields = [
            'schemename', 'category', 'gender', 'age_range', 'marital_status', 'income', 'caste', 'ministry', 'employment_status', 'documents','benefits','details'
        ]
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone_number', 'state', 'gender', 'income', 'age', 'city', 'marital_status', 'pincode', 'district', 'caste', 'employment_status']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password) 
        user.save()
        return user


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['adminname', 'email', 'password', 'phone_number']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        admin = Admin(**validated_data)
        admin.set_password(password) 
        admin.save()
        return admin
