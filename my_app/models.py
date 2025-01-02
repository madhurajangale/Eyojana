from djongo import models
from django.core.validators import RegexValidator
from django.core.validators import FileExtensionValidator
from django.contrib.auth.hashers import make_password
from django.utils.timezone import now 

from bson.objectid import ObjectId

def generate_object_id():
    return str(ObjectId())

class UserApplication(models.Model):
    id = models.CharField(max_length=24, primary_key=True, default=generate_object_id)
    user_email = models.EmailField(max_length=100)
    schemename = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='Pending')
    applied_on = models.DateTimeField(default=now)
    documents = models.JSONField(default=list, blank=True)
    uploaded_files = models.FileField(
        upload_to='documents/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'png', 'jpeg', 'jpg'])],
        null=True, blank=True
    )

    def clean(self):
        from .models import User, Scheme
        if not User.objects.filter(email=self.user_email).exists():
            raise ValidationError(f"User with email {self.user_email} does not exist.")
        if not Scheme.objects.filter(schemename=self.schemename).exists():
            raise ValidationError(f"Scheme with name {self.schemename} does not exist.")
def save(self, *args, **kwargs):
    print(f"Uploaded file: {self.uploaded_files}")  # Debug print
    self.full_clean()  # Run custom validations
    super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.user_email} applied for {self.schemename}"

    class Meta:
        db_table = 'user_application'



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
class Admin(models.Model):
    adminname = models.CharField(max_length=50, unique=True)
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

class Scheme(models.Model):
    schemename = models.CharField(max_length=100,unique=True)
    category = models.CharField(max_length=255)
    gender = models.CharField(max_length=20, null=True, blank=True)
    age_range = models.CharField(max_length=50, default='0')
    state = models.CharField(max_length=50, default='Maharashtra')
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



