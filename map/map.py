from flask import Flask, jsonify
from pymongo import MongoClient
from geopy.geocoders import Nominatim

app = Flask(__name__)

# MongoDB connection
client = MongoClient("mongodb+srv://shravanipatil1427:Shweta2509@cluster0.xwf6n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["Cluster0"]
collection = db["user"]

# Geolocator to get lat-long from pincode
geolocator = Nominatim(user_agent="geoapiExercises")


def get_coordinates(pincode):
    try:
        location = geolocator.geocode(pincode)
        if location:
            return location.latitude, location.longitude
    except Exception as e:
        print(f"Error geocoding pincode {pincode}: {e}")
    return None, None


@app.route("/usermap", methods=["GET"])
def user_map():
    # Fetch user counts from MongoDB
    data = list(collection.aggregate([
        {"$group": {"_id": "$pincode", "user_count": {"$sum": 1}}}
    ]))

    # Create GeoJSON structure
    features = []
    for entry in data:
        pincode = entry["_id"]
        user_count = entry["user_count"]

        if pincode:
            lat, lon = get_coordinates(pincode)
            if lat and lon:
                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lon, lat]
                    },
                    "properties": {
                        "pincode": pincode,
                        "user_count": user_count
                    }
                }
                features.append(feature)

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }

    return jsonify(geojson)


if __name__ == "__main__":
    app.run(debug=True, port=6000)
