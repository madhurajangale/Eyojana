from flask import Flask, request, jsonify
from surprise import SVD, Dataset, Reader
from surprise.model_selection import train_test_split
from surprise import accuracy
import pandas as pd
import numpy as np

app = Flask(__name__)

# Sample data (user-item interaction matrix)


# Convert the data into a DataFrame
# df = pd.DataFrame(data)

# # Set up the Reader object to define the rating scale
# reader = Reader(rating_scale=(1, 5))

# # Load the data into Surprise's Dataset format
# dataset = Dataset.load_from_df(df[['user', 'item', 'rating']], reader)

# # Train-test split
# trainset, testset = train_test_split(dataset, test_size=0.2)

# # Build and train the recommendation model (SVD in this case)
# model = SVD()
# model.fit(trainset)

# # Test the model
# predictions = model.test(testset)
# rmse = accuracy.rmse(predictions)
# print(f"RMSE: {rmse}")
@app.route('/receive-data', methods=['POST'])
def receive_data():
    # Parse incoming JSON data
    data = request.get_json()
    eligible_schemes = data.get("eligible_schemes", [])
    user_email = data.get("user_email")

    if not eligible_schemes:
        return jsonify({"message": "No schemes provided", "recommended_schemes": []}), 400

    print(f"User Email: {user_email}")
    print("Eligible Schemes with Ratings:")
    for scheme in eligible_schemes:
        print(f"Scheme: {scheme['scheme_name']}, Rating: {scheme['rating']}")

    # Create a DataFrame from the eligible schemes
    schemes_df = pd.DataFrame(eligible_schemes)

    # Sort the schemes by rating in descending order
    sorted_schemes = schemes_df.sort_values(by='rating', ascending=False)

    # Convert the sorted schemes to a list of dictionaries
    recommended_schemes = sorted_schemes.to_dict(orient='records')
    print("Recommended Schemes:")
    print(recommended_schemes)
    # Return the sorted schemes as the prioritized list
    return jsonify({
        "message": "Schemes prioritized successfully",
        "recommended_schemes": recommended_schemes
    }), 200

# @app.route('/recommend', methods=['POST'])
# def recommend():
#     # Get the user data from the request
#     user_data = request.get_json()
#     print(user_data)
#     user_id = user_data.get('email')

#     # Ensure the user_id is valid
#     if user_id not in df['user'].values:
#         return jsonify({"error": "Invalid user"}), 400
    
#     # Generate predictions for all items
#     items = df['item'].unique()
#     predictions = [model.predict(user_id, item) for item in items]
    
#     # Sort the items by predicted rating (higher is better)
#     sorted_predictions = sorted(predictions, key=lambda x: x.est, reverse=True)
    
#     # Get the top 3 recommended items (can be adjusted)
#     top_items = [pred.iid for pred in sorted_predictions[:3]]
#     print(top_items)
#     # Return the top 3 recommended schemes
#     return jsonify({"recommended_schemes": top_items})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)