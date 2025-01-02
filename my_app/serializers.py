from rest_framework import serializers
from .models import User, Admin, Scheme, UserApplication
from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist


from rest_framework import serializers
from .models import UserApplication, User, Scheme

class ApplicationCreateSerializer(serializers.ModelSerializer):
    documents = serializers.ListField(
        child=serializers.CharField(),  # Assuming documents are names/IDs stored as strings
        required=False,  # Optional field
    )

    class Meta:
        model = UserApplication
        fields = ['user_email', 'schemename', 'status', 'applied_on', 'documents']

    def validate(self, data):
        # Validate user_email exists in User model
        if not User.objects.filter(email=data['user_email']).exists():
            raise serializers.ValidationError({
                'user_email': f"User with email {data['user_email']} does not exist."
            })

        # Validate schemename exists in Scheme model
        if not Scheme.objects.filter(schemename=data['schemename']).exists():
            raise serializers.ValidationError({
                'schemename': f"Scheme with name {data['schemename']} does not exist."
            })

        return data

    def create(self, validated_data):
        """
        Override the create method to handle documents properly
        """
        documents = validated_data.pop('documents', [])  # Retrieve documents or set an empty list
        application = UserApplication.objects.create(**validated_data)
        
        # Process documents (if necessary)
        application.documents = documents
        application.save()
        
        return application



# class ApplicationCreateSerializer(serializers.ModelSerializer):
#     documents = serializers.ListField(
#         child=serializers.CharField(),  # You can specify any type of field (e.g., CharField for document names)
#         required=False,  # This makes the documents field optional
#     )

#     class Meta:
#         model = UserApplication
#         fields = ['user_email', 'schemename', 'status', 'applied_on', 'documents']

#     def validate(self, data):
#         from .models import User, Scheme

#         # Validate user_email exists in User model
#         if not User.objects.filter(email=data['user_email']).exists():
#             raise serializers.ValidationError(f"User with email {data['user_email']} does not exist.")

#         # Validate schemename exists in Scheme model
#         if not Scheme.objects.filter(schemename=data['schemename']).exists():
#             raise serializers.ValidationError(f"Scheme with name {data['schemename']} does not exist.")

#         return data

class ApplicationRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserApplication
        fields = ['id', 'user_email', 'schemename', 'status', 'applied_on', 'documents', 'uploaded_files']
        read_only_fields = ['id', 'status', 'applied_on']

class SchemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scheme
        fields = [
            'schemename', 'category', 'gender', 'age_range', 'state',
            'marital_status', 'income', 'caste', 'ministry', 'employment_status', 'documents'
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
