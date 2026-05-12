import re
from typing import Dict, List, Optional

class MoodService:
    def __init__(self):
        # Keywords for different mood categories
        self.mood_keywords = {
            'happy': ['happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'good', 'fantastic'],
            'sad': ['sad', 'depressed', 'down', 'unhappy', 'terrible', 'awful', 'bad', 'miserable'],
            'anxious': ['anxious', 'worried', 'nervous', 'stress', 'stressed', 'panic', 'afraid', 'scared', 'don\'t know'],
            'angry': ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'frustrated', 'upset'],
            'neutral': ['okay', 'fine', 'alright', 'normal', 'regular', 'usual']
        }
    
    def analyze_mood(self, text: str) -> Dict[str, float]:
        """
        Analyze text and return mood scores
        Returns dictionary with mood categories and their confidence scores
        """
        text_lower = text.lower()
        mood_scores = {}
        
        for mood, keywords in self.mood_keywords.items():
            score = 0
            for keyword in keywords:
                # Count occurrences of each keyword
                occurrences = len(re.findall(r'\b' + re.escape(keyword) + r'\b', text_lower))
                score += occurrences
            
            # Normalize score (simple approach)
            mood_scores[mood] = min(score / len(keywords), 1.0)
        
        return mood_scores
    
    def get_primary_mood(self, text: str) -> str:
        """
        Get the primary mood from text
        """
        mood_scores = self.analyze_mood(text)
        
        if not mood_scores or max(mood_scores.values()) == 0:
            return 'neutral'
        
        return max(mood_scores, key=mood_scores.get)
    
    def get_mood_emoji(self, mood: str) -> str:
        """
        Get emoji representation for mood
        """
        mood_emojis = {
            'happy': '😊',
            'sad': '😢',
            'anxious': '😰',
            'angry': '😠',
            'neutral': '😐'
        }
        return mood_emojis.get(mood, '😐')
    
    def track_mood_trend(self, mood_history: List[str]) -> Dict[str, any]:
        """
        Analyze mood trends from history
        """
        if not mood_history:
            return {'trend': 'stable', 'current': 'neutral'}
        
        current_mood = mood_history[-1]
        
        if len(mood_history) < 2:
            return {'trend': 'stable', 'current': current_mood}
        
        # Simple trend analysis
        positive_moods = ['happy']
        negative_moods = ['sad', 'anxious', 'angry']
        
        recent_moods = mood_history[-3:]  # Last 3 moods
        positive_count = sum(1 for mood in recent_moods if mood in positive_moods)
        negative_count = sum(1 for mood in recent_moods if mood in negative_moods)
        
        if positive_count > negative_count:
            trend = 'improving'
        elif negative_count > positive_count:
            trend = 'declining'
        else:
            trend = 'stable'
        
        return {
            'trend': trend,
            'current': current_mood,
            'recent_moods': recent_moods
        }