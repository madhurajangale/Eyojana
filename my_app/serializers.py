from rest_framework import serializers
from .models import User, Admin, Scheme, SchemeDocument



class SchemeDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchemeDocument
        fields = ['document_name', 'document']

class SchemeSerializer(serializers.ModelSerializer):
    documents = SchemeDocumentSerializer(many=True)

    class Meta:
        model = Scheme
        fields = ['schemename', 'user_id', 'email', 'status', 'category', 'documents']

    def create(self, validated_data):
     
        documents_data = validated_data.pop('documents', [])
        scheme = Scheme.objects.create(**validated_data)

        for document_data in documents_data:
            SchemeDocument.objects.create(scheme=scheme, **document_data)
        
        return scheme

    def validate_documents(self, value):
        if not value:
            raise serializers.ValidationError("At least one document is required.")
        return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone_number', 'state', 'gender']
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
