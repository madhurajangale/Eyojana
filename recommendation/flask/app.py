from flask import Flask, request, jsonify
from surprise import SVD, Dataset, Reader
from surprise.model_selection import train_test_split
from surprise import accuracy
import pandas as pd
import numpy as np

app = Flask(__name__)


@app.route('/receive-data', methods=['POST'])
def receive_data():
    print("&&&&&&&&&&&&")
    # Parse incoming JSON data
    data = request.get_json()
    print(data)
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

    top_schemes = sorted_schemes.head(3)

    # Convert the top schemes to a list of dictionaries
    recommended_schemes = top_schemes.to_dict(orient='records')

    print("Recommended Schemes:")
    print(recommended_schemes)

    # Return the top 3 schemes as the prioritized list
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
    app.run(debug=True, host='0.0.0.0', port=5002)