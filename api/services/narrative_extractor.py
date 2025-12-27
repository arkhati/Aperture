import os
import json
import google.generativeai as genai
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class NarrativeExtractor:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-flash-latest')

    async def extract_narrative(self, source_text: str) -> List[Dict[str, Any]]:
        """
        Extracts a timeline of events from the narrative.
        Returns a list of events: [{'order': 1, 'location': '...', 'description': '...', 'characters': [...]}]
        """
        
        prompt = f"""
        You are a narrative cartographer.
        Your goal is to analyze the story or text and extract a chronological timeline of key events (BookMap).

        Source Text:
        {source_text[:30000]} 

        Generate a JSON response (List of Objects) with the following structure:
        [
            {{
                "order": 1,
                "title": "Short Title of Event",
                "location": "Imagine a location/setting name",
                "description": "One sentence summary of what happened.",
                "characters": ["Name 1", "Name 2"]
            }}
        ]
        
        Rules:
        - Extract 5-10 key events.
        - Ensure "location" is evocative (e.g., "The Library of Alexandria", "Robert Langdon's Apartment").
        - "description" should be vivid but brief.
        
        Ensure the JSON is valid. Do not include markdown formatting blocks (like ```json), just the raw JSON.
        """

        try:
            response = self.model.generate_content(prompt)
            text_response = response.text.replace("```json", "").replace("```", "").strip()
            data = json.loads(text_response)
            return data
        except Exception as e:
            print(f"Error extracting narrative: {e}")
            return []
