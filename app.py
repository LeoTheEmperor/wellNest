from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import google.genai as genai
import sys
import os

# Add services directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'services'))
from response_service import ResponseService
from mood_services import MoodService

app = Flask(__name__)

# Enable CORS
CORS(app)

# Initialize services
response_service = ResponseService("AIzaSyDs6-73wEQJ1Y9YBPYIQZZRSAIbYkifwsE")
mood_service = MoodService()

# -------------------------
# DATABASE SETUP
# -------------------------
def get_db():
    conn = sqlite3.connect("database.db")
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # ✅ Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    """)

    # ✅ Chat sessions table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            title TEXT
        )
    """)

    # ✅ Messages table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            chat_id INTEGER,
            message TEXT,
            response TEXT
        )
    """)

    conn.commit()
    conn.close()

init_db()

# -------------------------
# AUTH ROUTES
# -------------------------

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json 
    username = data.get('username')
    password = data.get('password')

    conn = get_db()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, password)
        )
        conn.commit()
        return jsonify({"message": "User created"})
    except:
        return jsonify({"error": "User already exists"})
    finally:
        conn.close()


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE username=? AND password=?",
        (username, password)
    )

    user = cursor.fetchone()
    conn.close()

    if user:
        return jsonify({"user_id": user[0]})
    else:
        return jsonify({"error": "Invalid credentials"})


# -------------------------
# CHAT SESSION ROUTES
# -------------------------

@app.route('/new_chat', methods=['POST'])
def new_chat():
    data = request.json
    user_id = data.get('user_id')

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)",
        (user_id, "New Chat")
    )

    chat_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return jsonify({"chat_id": chat_id})


@app.route('/chats', methods=['POST'])
def get_chats():
    data = request.json
    user_id = data.get('user_id')

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, title FROM chat_sessions WHERE user_id=? ORDER BY id DESC",
        (user_id,)
    )

    chats = cursor.fetchall()
    conn.close()

    return jsonify(chats)


# -------------------------
# CHAT WITH GEMINI
# -------------------------

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message')
    chat_id = data.get('chat_id')

    print("Chat:", chat_id, "Message:", message)

    conn = get_db()
    cursor = conn.cursor()

    # Get last messages for context
    cursor.execute(
        "SELECT message, response FROM messages WHERE chat_id=? ORDER BY id DESC LIMIT 5",
        (chat_id,)
    )
    history = cursor.fetchall()

    # Convert to format expected by response service
    chat_history = []
    for msg, res in reversed(history):
        chat_history.append({'message': msg, 'response': res})

    # Use response service to generate contextual response
    try:
        response_data = response_service.generate_response_with_suggestions(message, chat_history)
        reply = response_data['response']
    except Exception as e:
        print("Response Service Error:", e)
        # Fallback to simple response
        reply = f"I understand you're saying: {message}. I'm here to help! 💙"
        response_data = {
            'mood': 'neutral',
            'suggestions': ['Take a deep breath', 'Talk to a friend'],
            'is_crisis': False,
            'emoji': '😐'
        }

    # Save message
    cursor.execute(
        "INSERT INTO messages (chat_id, message, response) VALUES (?, ?, ?)",
        (chat_id, message, reply)
    )

    conn.commit()
    conn.close()

    # Return enhanced response data
    return jsonify({
        "reply": reply,
        "mood": response_data.get('mood'),
        "suggestions": response_data.get('suggestions', []),
        "is_crisis": response_data.get('is_crisis', False),
        "emoji": response_data.get('emoji'),
        "hotline": response_data.get('hotline')
    })


# -------------------------
# MOOD ANALYSIS ROUTES
# -------------------------

@app.route('/analyze_mood', methods=['POST'])
def analyze_mood():
    data = request.json
    text = data.get('text', '')
    
    if not text:
        return jsonify({"error": "No text provided"})
    
    mood_scores = mood_service.analyze_mood(text)
    primary_mood = mood_service.get_primary_mood(text)
    emoji = mood_service.get_mood_emoji(primary_mood)
    
    return jsonify({
        "mood_scores": mood_scores,
        "primary_mood": primary_mood,
        "emoji": emoji
    })

@app.route('/mood_suggestions', methods=['POST'])
def get_mood_suggestions():
    data = request.json
    mood = data.get('mood', 'neutral')
    
    suggestions = response_service.get_mood_based_suggestions(mood)
    
    return jsonify({
        "mood": mood,
        "suggestions": suggestions
    })

# -------------------------
# PSYCHIATRIST LOCATOR ROUTE
# -------------------------

@app.route('/psychiatrists', methods=['GET'])
def get_psychiatrists():
    """Get list of psychiatrists with mock data"""
    psychiatrists = [
        {
            "id": 1,
            "name": "Dr. Sarah Johnson",
            "specialty": "Child & Adolescent Psychiatry",
            "location": "123 Medical Center Dr, Downtown",
            "distance": "2.3 km",
            "rating": 4.8,
            "contact": "+1 (555) 123-4567",
            "email": "sarah.johnson@medicalcenter.com",
            "availability": "Mon-Fri 9AM-5PM",
            "experience": "15 years",
            "languages": ["English", "Spanish"],
            "consultationFee": "$200",
            "acceptsInsurance": True
        },
        {
            "id": 2,
            "name": "Dr. Michael Chen",
            "specialty": "Adult Psychiatry",
            "location": "456 Health Ave, Midtown",
            "distance": "3.7 km",
            "rating": 4.9,
            "contact": "+1 (555) 234-5678",
            "email": "michael.chen@healthclinic.com",
            "availability": "Mon-Thu 8AM-6PM, Fri 8AM-4PM",
            "experience": "12 years",
            "languages": ["English", "Mandarin"],
            "consultationFee": "$180",
            "acceptsInsurance": True
        },
        {
            "id": 3,
            "name": "Dr. Emily Rodriguez",
            "specialty": "Geriatric Psychiatry",
            "location": "789 Senior Care Blvd, Westside",
            "distance": "5.1 km",
            "rating": 4.7,
            "contact": "+1 (555) 345-6789",
            "email": "emily.rodriguez@seniorhealth.com",
            "availability": "Tue-Sat 10AM-4PM",
            "experience": "20 years",
            "languages": ["English", "Spanish"],
            "consultationFee": "$150",
            "acceptsInsurance": False
        },
        {
            "id": 4,
            "name": "Dr. James Wilson",
            "specialty": "Addiction Psychiatry",
            "location": "321 Recovery Lane, Eastside",
            "distance": "6.8 km",
            "rating": 4.6,
            "contact": "+1 (555) 456-7890",
            "email": "james.wilson@recoverycenter.com",
            "availability": "24/7 Emergency Services",
            "experience": "18 years",
            "languages": ["English"],
            "consultationFee": "$220",
            "acceptsInsurance": True
        },
        {
            "id": 5,
            "name": "Dr. Lisa Thompson",
            "specialty": "General Psychiatry",
            "location": "654 Wellness St, North District",
            "distance": "4.2 km",
            "rating": 4.9,
            "contact": "+1 (555) 567-8901",
            "email": "lisa.thompson@wellnessclinic.com",
            "availability": "Mon-Wed 7AM-7PM, Thu-Fri 7AM-5PM",
            "experience": "10 years",
            "languages": ["English", "French"],
            "consultationFee": "$175",
            "acceptsInsurance": True
        }
    ]
    
    return jsonify({
        "psychiatrists": psychiatrists,
        "total": len(psychiatrists)
    })

# -------------------------
# CONTACT PAGE ROUTE
# -------------------------

@app.route('/contact', methods=['GET'])
def contact():
    return jsonify({
        "message": "Contact page data loaded successfully",
        "emergency_helplines": [
            {
                "name": "National Suicide Prevention Helpline",
                "number": "9152987821",
                "description": "24/7 crisis support",
                "type": "emergency"
            },
            {
                "name": "Vandrevala Foundation Helpline", 
                "number": "18602662345",
                "description": "Mental health support",
                "type": "crisis"
            }
        ],
        "mental_health_helplines": [
            {
                "name": "iCall",
                "number": "9152987821",
                "description": "Psychological counseling",
                "timing": "24/7"
            },
            {
                "name": "YourDOST",
                "number": "1800-123-4567", 
                "description": "Youth mental health support",
                "timing": "24/7"
            }
        ]
    })

# -------------------------
# GET MESSAGES
# -------------------------

@app.route('/messages/<int:chat_id>', methods=['GET'])
def get_messages(chat_id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT message, response FROM messages WHERE chat_id=?",
        (chat_id,)
    )

    rows = cursor.fetchall()
    conn.close()

    return jsonify(rows)


# -------------------------
# HOME
# -------------------------

@app.route('/')
def home():
    return "Backend running"


# -------------------------
# RUN APP
# -------------------------

if __name__ == "__main__":
    app.run(debug=True)