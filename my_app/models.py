from djongo import models
from django.core.validators import RegexValidator
from django.core.validators import FileExtensionValidator
from django.contrib.auth.hashers import make_password

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
    schemename = models.CharField(max_length=100)
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

    def __str__(self):
        return self.schemename
    
    class Meta:
        db_table = 'scheme'

