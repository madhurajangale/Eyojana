from rest_framework import serializers
from my_app.models import UserRating

class UserRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRating
        fields = ['user', 'scheme', 'rating']
        read_only_fields = ['user', 'scheme']
        # read_only_fields = ['_id']  # Prevent _id from being updated
