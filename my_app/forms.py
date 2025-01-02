from django import forms
from .models import User
from .models import UserApplication, Document

class UserCreationForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'phone_number', 'state', 'gender']


