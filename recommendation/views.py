# views.py

from django.http import JsonResponse
from my_app.models import User
import requests
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from my_app.models import User, UserRating,Scheme
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from bson import ObjectId
from my_app.models import UserRating
from .serializers import UserRatingSerializer
from rest_framework.exceptions import NotFound
import logging
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



logger = logging.getLogger(__name__)

class UpdateRatingView(APIView):
    # def patch(self, request, user_email, scheme_name):
    #     try:
    #         # Fetch the UserRating entry by user email and scheme name
    #         user_rating = UserRating.objects.get(user=user_email, scheme=scheme_name)

    #         # Log the fetched UserRating
    #         logger.debug(f'Fetched UserRating: {user_rating}')
            
    #         # Extract the MongoDB ObjectId
            

    #         # Use the serializer to validate and update the rating data
    #         serializer = UserRatingSerializer(user_rating, data=request.data, partial=True)  # partial=True allows partial updates
            
    #         if serializer.is_valid():
    #             # Ensure we are updating the correct entry
    #             UserRating.objects.get(user=user_email, scheme=scheme_name).update(**serializer.validated_data)
    #             return JsonResponse({
    #                 'status': 'success',
    #                 'message': 'Rating updated successfully.',
    #                 'data': serializer.data
    #             })
    #         return JsonResponse({'status': 'error', 'message': 'Invalid data.', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
    #     except UserRating.DoesNotExist:
    #         raise NotFound(detail="UserRating entry not found.", code=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, email,scheme):
        try:
            print("Incoming Request Data:", request.data)

            # Fetch the user using email
            user = get_object_or_404(User, email=email)
            print(f"User Found: {user}")

            # Fetch the UserRating object for this user and scheme
            scheme_name = request.data.get("scheme")  # Extract scheme name from request
            if not scheme_name:
                return JsonResponse({"error": "Scheme name is required."}, status=400)

            rating = get_object_or_404(UserRating, user=user, scheme=scheme_name)
            print(f"Existing Rating Found: {rating}")

            # Update rating using serializer
            serializer = UserRatingSerializer(rating, data=request.data, partial=True)

            if serializer.is_valid():
                print("Serializer Validated Data:", serializer.validated_data)
                serializer.save()  # Save the updated data
                return JsonResponse({
                    'status': 'success',
                    'message': 'Rating updated successfully.',
                    'data': serializer.data
                })

            print("Serializer Errors:", serializer.errors)
            return JsonResponse({'status': 'error', 'message': 'Invalid data.', 'errors': serializer.errors}, status=400)

        except UserRating.DoesNotExist:
            print("UserRating Entry Not Found")
            return JsonResponse({'status': 'error', 'message': 'User rating not found.'}, status=404)

        except User.DoesNotExist:
            print("User Not Found")
            return JsonResponse({'status': 'error', 'message': 'User not found.'}, status=404)

class CreateRatingView(APIView):
    def post(self, request):
        # Use the serializer to validate and create a new rating entry
        print(request.data)
        serializer = UserRatingSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()  # Save the new rating entry
            return JsonResponse({
                'status': 'success',
                'message': 'Rating created successfully.',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return JsonResponse({'status': 'error', 'message': 'Invalid data.', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
