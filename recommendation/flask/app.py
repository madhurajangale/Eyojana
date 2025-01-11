from flask import Flask, request, jsonify
from surprise import SVD, Dataset, Reader
from surprise.model_selection import train_test_split
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

    # Convert the eligible schemes into a DataFrame
    schemes_df = pd.DataFrame(eligible_schemes)

    # Filter out schemes with a rating of 0 (since they don't provide useful data)
    

    if schemes_df.empty:
        return jsonify({"message": "No eligible schemes with valid ratings"}), 400

    print("check")

    # Add user_email to every row for the same user (since we are only working with one user)
    schemes_df['user_email'] = user_email

    # Prepare the data for Surprise's reader
    reader = Reader(rating_scale=(1, 5))  # Assuming ratings are between 1 and 5
    data = Dataset.load_from_df(schemes_df[['user_email', 'scheme_name', 'rating']], reader)

    # Train-test split
    trainset, testset = train_test_split(data, test_size=0.2)

    # Use Singular Value Decomposition (SVD) algorithm
    model = SVD()
    model.fit(trainset)

    # Predict ratings for the schemes based on the user email
    predictions = []
    for _, scheme in schemes_df.iterrows():
        prediction = model.predict(user_email, scheme['scheme_name'])
        predictions.append((scheme['scheme_name'], scheme['documents'], prediction.est))

    # Sort schemes by predicted rating in descending order
    sorted_schemes = sorted(predictions, key=lambda x: x[2], reverse=True)

    # Get the top 3 recommended schemes
    top_schemes = sorted_schemes[:3]
    
    # Prepare the response with scheme_name, documents, and predicted rating
    recommended_schemes = [{"scheme_name": scheme[0], "documents": scheme[1], "predicted_rating": scheme[2]} for scheme in top_schemes]

    print("Recommended Schemes:")
    print(recommended_schemes)

    # Return the top 3 schemes as the prioritized list
    return jsonify({
        "message": "Schemes prioritized successfully",
        "recommended_schemes": recommended_schemes
    }), 200

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5002)
