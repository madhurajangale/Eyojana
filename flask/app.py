from flask import Flask, request, jsonify
from surprise import SVD, Dataset, Reader
from surprise.model_selection import train_test_split
from surprise import accuracy
import pandas as pd
import numpy as np

app = Flask(__name__)

# Sample data (user-item interaction matrix)
data = {
    'user': ['rujutamedhi@gmail.com', 'rujutamedhi@gmail.com', 'rujutamedhi@gmail.com','rujutamedhi@gmail.com', 'user2'],
    'item': ['scheme1', 'scheme2','scheme4' ,'scheme1', 'scheme3'],
    'rating': [5, 4, 0,4, 5]
}

# Convert the data into a DataFrame
df = pd.DataFrame(data)

# Set up the Reader object to define the rating scale
reader = Reader(rating_scale=(1, 5))

# Load the data into Surprise's Dataset format
dataset = Dataset.load_from_df(df[['user', 'item', 'rating']], reader)

# Train-test split
trainset, testset = train_test_split(dataset, test_size=0.2)

# Build and train the recommendation model (SVD in this case)
model = SVD()
model.fit(trainset)

# Test the model
predictions = model.test(testset)
rmse = accuracy.rmse(predictions)
print(f"RMSE: {rmse}")

@app.route('/recommend', methods=['POST'])
def recommend():
    # Get the user data from the request
    user_data = request.get_json()
    print(user_data)
    user_id = user_data.get('email')

    # Ensure the user_id is valid
    if user_id not in df['user'].values:
        return jsonify({"error": "Invalid user"}), 400
    
    # Generate predictions for all items
    items = df['item'].unique()
    predictions = [model.predict(user_id, item) for item in items]
    
    # Sort the items by predicted rating (higher is better)
    sorted_predictions = sorted(predictions, key=lambda x: x.est, reverse=True)
    
    # Get the top 3 recommended items (can be adjusted)
    top_items = [pred.iid for pred in sorted_predictions[:3]]
    
    # Return the top 3 recommended schemes
    return jsonify({"recommended_schemes": top_items})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)