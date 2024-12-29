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
    state = models.CharField(max_length=50)
    gender = models.CharField(max_length=25)

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

class SchemeDocument(models.Model):
    scheme = models.ForeignKey('Scheme', related_name='documents', on_delete=models.CASCADE)
    document_name = models.CharField(max_length=255)  # Document name
    document = models.FileField(upload_to='scheme_documents/', 
                                 validators=[FileExtensionValidator(allowed_extensions=['pdf', 'png'])])  
    def __str__(self):
        return self.document_name 
class Scheme(models.Model):
    schemename = models.CharField(max_length=100)
    user_id = models.CharField(max_length=100) 
    email = models.EmailField(max_length=100, unique=True) 
    status = models.CharField(max_length=20, default='pending')
    category = models.CharField(max_length=255) 

    def __str__(self):
        return self.schemename 
