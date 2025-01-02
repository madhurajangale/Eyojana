from rest_framework import serializers
from .models import User, Admin, Scheme
from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from .models import UserApplications
from django.core.exceptions import ValidationError


from pymongo import MongoClient
from gridfs import GridFS
from bson import ObjectId



class DocumentSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    file = serializers.FileField()

    def create(self, validated_data):
        """
        Custom document processing (if required).
        """
        return validated_data


class UserApplicationsSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = UserApplications
        fields = ['id', 'user_email', 'scheme_name', 'category', 'status', 'applied_date', 'documents']

    def validate(self, data):
        """
        Validate the application data.
        """
        user_email = data.get('user_email')
        scheme_name = data.get('scheme_name')

        # Check if user exists
        if not User.objects.filter(email=user_email).exists():
            raise serializers.ValidationError({'user_email': "The user with this email does not exist."})

        # Check if scheme exists
        if not Scheme.objects.filter(schemename=scheme_name).exists():
            raise serializers.ValidationError({'scheme_name': "The scheme with this name does not exist."})

        return data

    def create(self, validated_data):
        """
        Create a new application and save documents in GridFS.
        """
        documents = validated_data.pop('documents', [])
        application = UserApplications.objects.create(**validated_data)

        # Connect to MongoDB and GridFS
        client = MongoClient('mongodb://localhost:27017/')
        db = client['your_database_name']
        fs = GridFS(db)

        for document in documents:
            file_id = fs.put(document['file'], filename=document['name'])
            application.add_document(name=document['name'], file_id=file_id)

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
            'schemename', 'category', 'gender', 'age_range', 'state',
            'marital_status', 'income', 'caste', 'ministry', 'employment_status', 'documents','benefits','details'
        ]

    def create(self, validated_data):
        scheme = Scheme.objects.create(**validated_data)        
        return scheme


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
