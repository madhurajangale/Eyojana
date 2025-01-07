from djongo import models
from django.core.validators import RegexValidator
from django.core.validators import FileExtensionValidator
from django.contrib.auth.hashers import make_password
from django.utils.timezone import now 
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.timezone import now
from django.conf import settings
from gridfs import GridFS
from pymongo import MongoClient
import os
from bson import ObjectId

from bson.objectid import ObjectId

def generate_object_id():
    return str(ObjectId())

# Assuming you are using a MongoDB connection
mongo_client = MongoClient('mongodb+srv://shravanipatil1427:Shweta2509@cluster0.xwf6n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = mongo_client['Cluster0']
fs = GridFS(db)
from bson import ObjectId

class UserApplications(models.Model):
    id = models.CharField(primary_key=True, max_length=24, default=lambda: str(ObjectId()))
    user_email = models.EmailField()
    scheme_name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='Pending')
    applied_date = models.DateTimeField(auto_now_add=True)
    documents = models.JSONField(default=list) 

    def add_document(self, name, file_id):
        self.documents.append({"name": name, "file_id": str(file_id)})
        self.save()

    def __str__(self):
        return f"{self.user_email} - {self.scheme_name}"

    class Meta:
        db_table = 'user_applications'


class User(models.Model):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=255)
    phone_number = models.CharField(
        max_length=10,
        validators=[RegexValidator(r'^[7-9][0-9]{9}$', message="Phone number must start with 7-9 and have 10 digits.")]
    )
    income=models.IntegerField(default=0)
    age=models.IntegerField(default=0)
    pincode=models.IntegerField(default=0)
    city=models.CharField(max_length=50,default='')
    district=models.CharField(max_length=50,default='')
    state = models.CharField(max_length=50)
    gender = models.CharField(max_length=25)
    caste=models.CharField(max_length=30, default='general')
    employment_status=models.CharField(max_length=30, default='unemployed')
    marital_status=models.CharField(max_length=30, default='unmarried')

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'user'

class Scheme(models.Model):
    schemename = models.CharField(max_length=100,unique=True)
    category = models.CharField(max_length=255)
    gender = models.CharField(max_length=20, null=True, blank=True)
    age_range = models.CharField(max_length=50, default='0')
    marital_status = models.CharField(max_length=20, null=True, blank=True)
    income = models.CharField(max_length=50, default='0')
    caste = models.JSONField(default=list) 
    documents = models.JSONField(default=list)
    ministry = models.CharField(max_length=100, null=True, blank=True)
    employment_status = models.CharField(max_length=20, null=True, blank=True)
    benefits=models.CharField(max_length=500, null=True, blank=True)
    details=models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return self.schemename
    
    class Meta:
        db_table = 'scheme'

class Admin(models.Model):
    adminname = models.CharField(max_length=50, unique=True)
    pincode=models.IntegerField(default=0)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=255)
    phone_number = models.CharField(
        max_length=10,
        validators=[RegexValidator(r'^[7-9][0-9]{9}$', message="Phone number must start with 7-9 and have 10 digits.")]
    )

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def __str__(self):
        return self.adminname

    class Meta:
        db_table = 'admin'

class UserRating(models.Model):
    user = models.EmailField()
    scheme = models.CharField(max_length=255)
    rating = models.IntegerField()
    custom_id = models.CharField(max_length=255, unique=True, blank=True,primary_key=True)

    def save(self, *args, **kwargs):
        if not self.custom_id:
            self.custom_id = f"{self.user}_{self.scheme}"
            print(f"Saving UserRating: {self.custom_id} with rating {self.rating}")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user} - {self.scheme}"

    class Meta:
        db_table = 'scheme_rating'
        indexes = [
            models.Index(fields=['user', 'scheme']), 
        ]
