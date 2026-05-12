import google.genai as genai
from typing import List, Dict, Optional
from mood_services import MoodService

class ResponseService:
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)
        self.model = "gemini-2.5-flash"
        self.mood_service = MoodService()
        
        # Response templates based on mood
        self.response_templates = {
            'happy': {
                'greeting': "I'm so glad to hear you're feeling positive! ",
                'encouragement': "Keep that wonderful energy going! ",
                'closing': "You're doing amazing! 💙"
            },
            'sad': {
                'greeting': "I'm here for you during this difficult time. ",
                'encouragement': "It's okay to feel this way, and you're not alone. ",
                'closing': "Remember, brighter days are ahead. 💙"
            },
            'anxious': {
                'greeting': "Let's take a deep breath together. ",
                'encouragement': "Anxiety is tough, but you have the strength to handle this. ",
                'closing': "You're stronger than you think. 💙"
            },
            'angry': {
                'greeting': "I understand you're feeling frustrated right now. ",
                'encouragement': "Your feelings are valid, and we'll work through this. ",
                'closing': "Take your time to process this. 💙"
            },
            'neutral': {
                'greeting': "I'm here to listen and support you. ",
                'encouragement': "How can I help you today? ",
                'closing': "I'm here whenever you need me. 💙"
            }
        }
    
    def generate_contextual_response(self, message: str, chat_history: List[Dict], user_mood: Optional[str] = None) -> str:
        """
        Generate a response based on message, history, and detected mood
        """
        # Detect mood if not provided
        if not user_mood:
            user_mood = self.mood_service.get_primary_mood(message)
        
        # Build conversation context
        context = self._build_context(chat_history)
        
        # Get mood-specific template
        template = self.response_templates.get(user_mood, self.response_templates['neutral'])
        
        # Create personalized prompt
        prompt = f"""
        You are WellNest, a caring student mental health assistant.
        
        Current user mood: {user_mood}
        {template['greeting']}
        
        Conversation context:
        {context}
        
        User message: {message}
        
        Guidelines:
        - Respond in a supportive, empathetic way
        - Keep responses concise
        - Use the mood-specific tone: {template['encouragement']}
        - End with a caring message: {template['closing']}
        - If user mentions serious mental health concerns, suggest professional help
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )
            return response.text if response.text else f"{template['greeting']}{template['closing']}"
        except Exception as e:
            print(f"Gemini API Error: {e}")
            return f"{template['greeting']}I'm here for you. {template['closing']}"
    
    def _build_context(self, chat_history: List[Dict]) -> str:
        """
        Build conversation context from chat history
        """
        if not chat_history:
            return "This is the beginning of our conversation."
        
        context = ""
        # Take last 5 messages for context
        recent_history = chat_history[-5:]
        
        for msg in recent_history:
            context += f"User: {msg.get('message', '')}\nAssistant: {msg.get('response', '')}\n"
        
        return context
    
    def get_crisis_response(self, message: str) -> Dict[str, str]:
        """
        Check for crisis indicators and provide appropriate response
        """
        crisis_keywords = [
            'suicide', 'kill myself', 'end my life', 'want to die',
            'self harm', 'hurt myself', 'no reason to live',
            'better off dead', 'can\'t go on'
        ]
        
        message_lower = message.lower()
        
        for keyword in crisis_keywords:
            if keyword in message_lower:
                return {
                    'is_crisis': True,
                    'response': "I'm really concerned about you. Please reach out to a crisis hotline immediately. Contact a local emergency service. You matter, and there are people who want to help you right now.",
                    'hotline': "14416"
                }
        
        return {'is_crisis': False, 'response': '', 'hotline': ''}
    
    def get_mood_based_suggestions(self, mood: str) -> List[str]:
        """
        Get suggestions based on current mood
        """
        suggestions = {
            'happy': [
                "Share your positive experience with a friend",
                "Write down what made you happy today",
                "Take a moment to savor this feeling"
            ],
            'sad': [
                "Try a gentle walk or light exercise",
                "Listen to calming music",
                "Talk to a trusted friend or family member"
            ],
            'anxious': [
                "Practice deep breathing: 4 counts in, hold 4, exhale 4",
                "Write down your worries to get them out of your head",
                "Try grounding exercises (5-4-3-2-1 technique)"
            ],
            'angry': [
                "Take a break and count to 10",
                "Physical activity can help release anger",
                "Write down what's making you angry"
            ],
            'neutral': [
                "Check in with yourself about how you're really feeling",
                "Try something creative or learn something new",
                "Reach out to someone you haven't talked to in a while"
            ]
        }
        
        return suggestions.get(mood, suggestions['neutral'])
    
    def generate_response_with_suggestions(self, message: str, chat_history: List[Dict]) -> Dict[str, any]:
        """
        Generate response and include mood-based suggestions
        """
        # Check for crisis first
        crisis_check = self.get_crisis_response(message)
        if crisis_check['is_crisis']:
            return {
                'response': crisis_check['response'],
                'mood': 'crisis',
                'suggestions': [],
                'is_crisis': True,
                'hotline': crisis_check['hotline']
            }
        
        # Detect mood
        user_mood = self.mood_service.get_primary_mood(message)
        
        # Generate response
        response = self.generate_contextual_response(message, chat_history, user_mood)
        
        # Get suggestions
        suggestions = self.get_mood_based_suggestions(user_mood)
        
        return {
            'response': response,
            'mood': user_mood,
            'suggestions': suggestions,
            'is_crisis': False,
            'emoji': self.mood_service.get_mood_emoji(user_mood)
        }