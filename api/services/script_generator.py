import os
import json
import google.generativeai as genai
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

class ScriptGenerator:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-flash-latest')

    async def generate_script(self, source_text: str) -> List[Dict[str, str]]:
        """
        Generates a podcast script from the source text using Gemini.
        Returns a list of dialogue items: [{"speaker": "Host 1", "text": "..."}]
        """
        
        prompt = f"""
        You are the producer of a highly engaging educational podcast.
        Your goal is to take the provided text and convert it into a natural, conversational dialogue between two hosts:
        - Host 1 (The Expert): Knowledgeable, explains concepts clearly.
        - Host 2 (The Curious Learner): Asks good questions, makes analogies, keeps it grounded.

        Source Text:
        {source_text[:30000]} 

        Generate a JSON response with the following structure:
        [
            {{"speaker": "Host 1", "text": "Welcome back..."}},
            {{"speaker": "Host 2", "text": "Topic..."}}
        ]
        
        CRITICAL RULES for DURATION (Target: 2 Minutes):
        - Generate a dialogue that lasts approximately 2 MINUTES.
        - Target word count: 300-350 words total.
        - Structure: Intro -> Deep Dive (2-3 concepts) -> Conclusion.
        - Exchanges: Roughly 8-12 conversational turns.
        - Keep it snappy but cover the topic with enough depth for 2 minutes.
        
        Ensure the JSON is valid. Do not include markdown formatting blocks (like ```json), just the raw JSON.
        """

        try:
            response = self.model.generate_content(prompt)
            # clean response if it contains markdown code blocks
            text_response = response.text.replace("```json", "").replace("```", "").strip()
            script = json.loads(text_response)
            return script
        except Exception as e:
            print(f"Error generating script: {e}")
            return [
                {"speaker": "System", "text": f"Error generating script: {str(e)}"}
            ]

