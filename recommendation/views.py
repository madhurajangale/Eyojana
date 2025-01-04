# views.py

from django.http import JsonResponse
from my_app.models import User
import requests
from rest_framework.views import APIView

class GetRecommendation(APIView):
# Eligibility-based recommendation
 def get(self,request, email):
    # Fetch user data from the database
    user = User.objects.get(email=email)
    
    # Prepare the data to send to Flask
    data = {
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
    print("&&&&&&&&&&&&&&&&&&&&&&&")
    # Send data to Flask (assuming Flask is running on localhost:5000)
    flask_response = requests.post('http://localhost:5000/recommend', json=data)
    
    # Get recommendations from Flask
    recommendations = flask_response.json()

    return JsonResponse(recommendations)

 def check_eligibility(user_data):
    # Example eligibility criteria based on user data (can be expanded as needed)
    eligible_schemes = []

    if user_data['income'] > 50000:  # Example: Income should be greater than 50k
        eligible_schemes.append("Scheme A")

    if user_data['age'] >= 18 and user_data['employment_status'] == 'Employed':  # Example: Age 18+ and employed
        eligible_schemes.append("Scheme B")

    if user_data['pincode'] == "110001":  # Example: Specific pincode eligibility
        eligible_schemes.append("Scheme C")

    return eligible_schemes