from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
 
app = Flask(__name__)
CORS(app)
 
@app.route('/')
def home():
    return "Backend is running!"
 
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json 
    return jsonify({"message": "User created"})
 
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    return jsonify({"user_id": 1})
 
@app.route('/new_chat', methods=['POST'])
def new_chat():
    return jsonify({"chat_id": 1})
 
@app.route('/chats', methods=['POST'])
def get_chats():
    return jsonify([])
 
@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    return jsonify({
        "reply": f"I hear you saying: {data.get('message', '')}. I'm here to help! 💙",
        "mood": "neutral",
        "suggestions": ["Take a deep breath", "Talk to a friend"],
        "is_crisis": False,
        "emoji": "😐"
    })
 
@app.route('/messages/<int:chat_id>', methods=['GET'])
def get_messages(chat_id):
    return jsonify([])
 
if __name__ == "__main__":
    print("🚀 Starting WellNest Backend on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)