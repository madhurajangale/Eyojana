from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from pymongo import MongoClient
from bson.json_util import dumps
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")   #async_mode="eventlet"

# MongoDB Atlas connection
mongo_uri = os.getenv('MONGO_URI', 'mongodb+srv://shravanipatil1427:Shweta2509@cluster0.xwf6n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')  # Use environment variable for security
client = MongoClient(mongo_uri)
db = client['Cluster0']
messages_collection = db['messages']

# Get all messages
@app.route('/messages', methods=['GET'])
def get_messages():
    messages = list(messages_collection.find({}, {'_id': 0}))
    return jsonify(messages)

# Post a new message
@app.route('/messages', methods=['POST'])
def post_message():
    message = request.json
    result = messages_collection.insert_one(message)
    if result.inserted_id:
        socketio.emit('message', message)
        return jsonify(message), 201
    return jsonify({'error': 'Failed to save message'}), 500

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True)
