from rest_framework import serializers
from my_app.models import UserRating

class UserRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRating
        fields = ['user', 'scheme', 'rating']
        
        # read_only_fields = ['_id']  # Prevent _id from being updated

def validate(self, data):
    if UserRating.objects.filter(user=data['user'], scheme=data['scheme']).exists():
        raise serializers.ValidationError("Rating for this user and scheme already exists.")
    return data
