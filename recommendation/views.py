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

import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import logging

logger = logging.getLogger(__name__)

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import json
import requests

class UpdateRatingView(APIView):
    def post(self, request):
        try:
            user_email = request.data.get("user")
            scheme_name = request.data.get("scheme")

            if not user_email or not scheme_name:
                return Response(
                    {"error": "Missing user or scheme field."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Create or update user rating logic (unchanged)
            custom_id = f"{user_email}_{scheme_name}"
            try:
                user_rating = UserRating.objects.get(custom_id=custom_id)
                user_rating.rating += 0.5
                if user_rating.rating > 5:
                    user_rating.rating = 5
                user_rating.save()
            except UserRating.DoesNotExist:
                user_rating = UserRating.objects.create(
                    custom_id=custom_id,
                    user=user_email,
                    scheme=scheme_name,
                    rating=0  # Initial rating
                )

            # Fetch eligible schemes
            eligibility_response = self.get_eligible_schemes(user_email)

            # Send eligible schemes to Flask
            self.send_data_to_flask(eligibility_response,user_email)

            return Response(
                {
                    "message": "Rating updated successfully.",
                    "rating": user_rating.rating,
                    "eligible_schemes": eligibility_response,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_eligible_schemes(self, user_email):
        """
        Fetch eligible schemes using EligibilityCheckView and include their ratings.
        """
        try:
            eligibility_view = EligibilityCheckView()
            request_mock = RequestFactory().get(f"/eligibility-check/{user_email}/")
            response = eligibility_view.get(request_mock, user_email)
            eligible_schemes = response.data.get("eligible_schemes", [])

            # Add ratings to each eligible scheme
            for scheme in eligible_schemes:
                scheme_name = scheme.get("scheme_name")
                if scheme_name:
                    custom_id = f"{user_email}_{scheme_name}"
                    try:
                        # Fetch the rating if it exists
                        user_rating = UserRating.objects.get(custom_id=custom_id)
                        scheme["rating"] = user_rating.rating
                    except UserRating.DoesNotExist:
                        scheme["rating"] = 0  # Default rating if not found

            return eligible_schemes
        except Exception as e:
            print(f"Error fetching eligible schemes: {e}")
            return []


    def send_data_to_flask(self, eligible_schemes, user_email):
        """
        Send eligible schemes (with ratings) to the Flask app.
        """
        try:
            flask_url = "http://127.0.0.1:5000/receive-data"  # Flask app URL
            flask_data = {
                "eligible_schemes": eligible_schemes,  # Pass eligible schemes with ratings
                "user_email": user_email
            }
            response = requests.post(flask_url, json=flask_data)

            if response.status_code != 200:
                print(f"Failed to send data to Flask: {response.text}")
        except Exception as e:
            print(f"Error sending data to Flask: {e}")




class EligibilityCheckView(APIView):
    def get(self, request, user_email):
        try:
            # Fetch user data by email
            user = User.objects.get(email=user_email)
            print(f"User data: {user}")

            # Fetch scheme data by scheme name
            
            try:
                # Fetch all schemes from the collection
                schemes = Scheme.objects.all()  # Retrieves all scheme entries
                eligible_schemes = []  # To store eligible schemes

                for scheme in schemes:
                    # Check eligibility for each scheme
                    is_eligible = self.is_eligible(user, scheme)
                    if is_eligible:
                        eligible_schemes.append({
                            'scheme_name': scheme.schemename,
                            'documents': self.serialize_list(scheme.documents),
                        })

                # Return the eligible schemes
                return Response({
                    'user': user.email,
                    'eligible_schemes': eligible_schemes,
                }, status=status.HTTP_200_OK)

            except Scheme.DoesNotExist:
                return Response({
                    'error': 'No schemes found'
                }, status=status.HTTP_404_NOT_FOUND)
            except User.DoesNotExist:
                return Response({
                    'error': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
                print(f"Error: {e}")
                return Response({
                    'error': str(e),
                    'message': 'Failed to check eligibility'
                }, status=status.HTTP_400_BAD_REQUEST)



    def is_eligible(self, user, scheme):
    
     try:
        # Check gender
        if user.gender.lower() != scheme.gender.lower():
            print("Ineligible due to gender mismatch")
            return False

        # Check age range
        age_range = scheme.age_range.split("-")  # Assuming "22-47"
        min_age, max_age = int(age_range[0]), int(age_range[1])
        if not (min_age <= user.age <= max_age):
            print("Ineligible due to age not in range")
            return False

        # Check marital status
        if scheme.marital_status.lower() != "any" and user.marital_status.lower() != scheme.marital_status.lower():
            print("Ineligible due to marital status mismatch")
            return False

        # Check caste
        

# Safely parse the caste field
        if isinstance(scheme.caste, str):
            try:
                eligible_castes = [caste.strip().lower() for caste in json.loads(scheme.caste)]
            except json.JSONDecodeError:
                print("Error: Invalid caste format")
                return False
        elif isinstance(scheme.caste, list):
            eligible_castes = [caste.strip().lower() for caste in scheme.caste]
        else:
            print("Error: Unsupported caste type")
            return False

        if user.caste.lower() not in eligible_castes:
            print("Ineligible due to caste mismatch")
            return False

        # Check income
        if "<" in scheme.income:
            max_income = int(scheme.income.replace("<", "").replace(",", "").strip())
            if user.income >= max_income:
                print("Ineligible due to income exceeding maximum limit")
                return False
        elif ">" in scheme.income:
            min_income = int(scheme.income.replace(">", "").replace(",", "").strip())
            if user.income <= min_income:
                print("Ineligible due to income below minimum limit")
                return False

        # Check employment status
        if scheme.employment_status.lower() != "any" and user.employment_status.lower() != scheme.employment_status.lower():
            print("Ineligible due to employment status mismatch")
            return False

        # If all checks pass, user is eligible
        return True
     except Exception as e:
        print(f"Error in eligibility check: {e}")
        return False

        

    def serialize_list(self, input_list):
        """
        Serializes a list into a JSON string.
        If the list is empty or invalid, return an empty string.
        """
        if isinstance(input_list, list):
            return json.dumps(input_list)  # Convert list to JSON string
        else:
            return str(input_list)  # If it's not a list, return the string version



# class UpdateRatingView(APIView):
#  def patch(self,request):
    # try:
        
    #     data = json.loads(request.body.decode('utf-8')) 
    #     user = data.get('user') 
    #     scheme = data.get('scheme')
        
    #     # Find the unique combination in the MongoDB collection
    #     rating_obj = get_object_or_404(UserRating, user=user, scheme=scheme)
        
    #     # Increment the rating by 0.5
    #     rating_obj.rating += 0.5
    #     rating_obj.save()
        
    #     response_data = {
    #         'user': rating_obj.user,
    #         'scheme': rating_obj.scheme,
    #         'rating': 6,
    #         'message': 'Rating updated successfully.'
    #     }
    #     return JsonResponse(response_data, status=200)
    
    # except Exception as e:
    #     response_data = {
    #         'error': str(e),
    #         'message': 'Failed to update the rating.'
    #     }
    #     return JsonResponse(response_data, status=400)

#working
# from django.core.exceptions import ObjectDoesNotExist



# logger = logging.getLogger(__name__)

# class UpdateRatingView(APIView):
#     def patch(self, request, *args, **kwargs):
#         try:
#             # Parse the JSON data from the request body
#             data = json.loads(request.body.decode('utf-8'))
#             user = data.get('user')
#             scheme = data.get('scheme')
            
#             logger.info(f"Received data: user={user}, scheme={scheme}")

#             try:
#                 # Find the unique combination in the database
#                 rating_obj = UserRating.objects.get(user=user, scheme=scheme)
#                 logger.info(f"Found rating object: {rating_obj}")
#                 logger.info(f"Current rating: {rating_obj.rating}")

#                 # Increment the rating by 0.5
#                 rating_obj.rating += 0.5
#                 rating_obj.save()
                
#                 logger.info(f"Updated rating: {rating_obj.rating}")

#                 response_data = {
#                     'user': rating_obj.user,
#                     'scheme': rating_obj.scheme,
#                     'rating': rating_obj.rating,
#                     'message': 'Rating updated successfully.'
#                 }
#                 return Response(response_data, status=200)
            
#             except ObjectDoesNotExist:
#                 # Create a new entry with a rating of 0
#                 new_rating = UserRating(user=user, scheme=scheme, rating=0)
#                 new_rating.save()
                
#                 logger.info(f"Created new rating object: {new_rating}")
                
#                 response_data = {
#                     'user': new_rating.user,
#                     'scheme': new_rating.scheme,
#                     'rating': new_rating.rating,
#                     'message': 'New rating entry created with rating 0.'
#                 }
#                 return Response(response_data, status=201)
        
#         except Exception as e:
#             logger.error(f"Error updating rating: {e}")
#             response_data = {
#                 'error': str(e),
#                 'message': 'Failed to update the rating.'
#             }
#             return Response(response_data, status=400)
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist
from django.test import RequestFactory

# class UpdateRatingView(APIView):
#     def patch(self, request, *args, **kwargs):
#         try:
#             # Parse the JSON data from the request body
#             data = json.loads(request.body.decode('utf-8'))
#             user = data.get('user')
#             scheme = data.get('scheme')
            
#             logger.info(f"Received data: user={user}, scheme={scheme}")

#             try:
#                 # Find the unique combination in the database
#                 rating_obj = UserRating.objects.get(user=user, scheme=scheme)
#                 logger.info(f"Found rating object: {rating_obj}")
#                 logger.info(f"Current rating: {rating_obj.rating}")

#                 # Increment the rating by 0.5
#                 rating_obj.rating += 0.5
#                 rating_obj.save()

#                 logger.info(f"Updated rating: {rating_obj.rating}")

#                 # Call EligibilityCheckView after saving
#                 eligibility_response = self.call_eligibility_check(user,scheme)

#                 response_data = {
#                     'user': rating_obj.user,
#                     'scheme': rating_obj.scheme,
#                     'rating': rating_obj.rating,
#                     'message': 'Rating updated successfully.',
#                     'eligibility_response': eligibility_response
#                 }
#                 return Response(response_data, status=200)

#             except ObjectDoesNotExist:
#                 # Create a new entry with a rating of 0
#                 new_rating = UserRating(user=user, scheme=scheme, rating=0)
#                 new_rating.save()

#                 logger.info(f"Created new rating object: {new_rating}")

#                 # Call EligibilityCheckView after saving
#                 eligibility_response = self.call_eligibility_check(user)

#                 response_data = {
#                     'user': new_rating.user,
#                     'scheme': new_rating.scheme,
#                     'rating': new_rating.rating,
#                     'message': 'New rating entry created with rating 0.',
#                     'eligibility_response': eligibility_response
#                 }
#                 return Response(response_data, status=201)

#         except Exception as e:
#             logger.error(f"Error updating rating: {e}")
#             response_data = {
#                 'error': str(e),
#                 'message': 'Failed to update the rating.'
#             }
#             return Response(response_data, status=400)

#     def call_eligibility_check(self, user_email,scheme):
#         """
#         Calls the eligibility check view logic.
#         """
#         try:
#             eligibility_view = EligibilityCheckView()
#             request_mock = RequestFactory().get(f"/eligibility-check/{user_email}/{scheme}") 
#             response = eligibility_view.get(request_mock, user_email, scheme)  # Expecting user_email and scheme to be passed
#             return response.data 
#         except Exception as e:
#             logger.error(f"Error calling eligibility check: {e}")
#             return {"error": str(e), "message": "Failed to fetch eligibility"}

    
# class UpdateRatingView(APIView):
#     def get_object(self, custom_id):
#         """Retrieve the UserRating object based on custom_id."""
#         try:
#             return UserRating.objects.get(custom_id=custom_id)
#         except UserRating.DoesNotExist:
#             return None
#     def patch(self, request, custom_id):
#         try:
#             # Log the incoming request
#             print("Incoming Request Data:", request.data)
#             print("Custom ID:", custom_id)
#             rating=self.get_object(custom_id)
#             # Fetch the existing UserRating entry by user email and scheme name
#             # rating = UserRating.objects.filter(user=user_email, scheme=scheme_name).first()
#             if not rating:
#                 return JsonResponse({'status': 'error', 'message': 'User rating not found.'}, status=404)
            
#             mongo_id = rating.id  # 'id' is the default attribute for MongoDB's ObjectId field
#             print("MongoDB _id:", str(mongo_id))
            
#             # Prepare updated data, allowing partial updates
#             updated_data = {
#                 "user": rating.user,
#                 "scheme": rating.scheme,
#                 "rating": request.data.get("rating", rating.rating)  # Update rating or keep the current value
#             }

#             # Serialize the updated data
#             serializer = UserRatingSerializer(instance=rating, data=updated_data, partial=False)
            
#             if serializer.is_valid():
#                 # Save updates to the existing entry
#                 updated_instance = serializer.save()
                
#                 print(f"Updated Instance Details: {updated_instance}")
                
#                 return JsonResponse({
#                     'status': 'success',
#                     'message': 'Rating updated successfully.',
#                     'data': serializer.data
#                 }, status=200)

#             print("Serializer Errors:", serializer.errors)
#             return JsonResponse({'status': 'error', 'message': 'Invalid data.', 'errors': serializer.errors}, status=400)

#         except Exception as e:
#             print(f"Unexpected Error: {str(e)}")
#             return JsonResponse({'status': 'error', 'message': 'An unexpected error occurred.', 'error': str(e)}, status=500)



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

