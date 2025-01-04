from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import json

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Load messages from a JSON file
def load_messages():
    try:
        with open('messages.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# Save messages to a JSON file
def save_messages(messages):
    with open('messages.json', 'w') as f:
        json.dump(messages, f)

messages = load_messages()

@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(messages)

@app.route('/messages', methods=['POST'])
def post_message():
    message = request.json
    messages.append(message)
    save_messages(messages)
    socketio.emit('message', message)
    return jsonify(message), 201

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app, debug=True)
