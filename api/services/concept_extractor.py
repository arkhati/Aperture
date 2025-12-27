import os
import json
import google.generativeai as genai
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class ConceptExtractor:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-flash-latest')

    async def extract_concepts(self, source_text: str) -> Dict[str, Any]:
        """
        Extracts concepts (nodes) and relationships (links) from the source text.
        Returns a JSON structure suitable for force-directed graphs:
        {
            "nodes": [{"id": "Concept A", "group": 1}],
            "links": [{"source": "Concept A", "target": "Concept B", "value": 5}]
        }
        """
        
        prompt = f"""
        You are a scientific knowledge extractor.
        Your goal is to analyze the provided text and extract key concepts and their relationships to build a Knowledge Graph (WordWeb).

        Source Text:
        {source_text[:30000]} 

        Generate a JSON response with the following structure:
        {{
            "nodes": [
                {{"id": "Concept Name", "group": 1, "description": "Short definition"}} 
            ],
            "links": [
                {{"source": "Concept Name", "target": "Related Concept Name", "value": 1, "description": "How they are related"}}
            ]
        }}
        
        Rules:
        - "nodes": Identify the most important entities, theories, or keywords. Group them logically (e.g., 1 for core concepts, 2 for secondary).
        - "links": Identify how these nodes connect. "value" should represent the strength of the connection (1-10).
        - Ensure "source" and "target" within "links" MATCH exactly with an "id" in "nodes".
        - Do not create disconnected nodes if possible.
        - Start with the central theme as the main node.
        
        Ensure the JSON is valid. Do not include markdown formatting blocks (like ```json), just the raw JSON.
        """

        try:
            response = self.model.generate_content(prompt)
            text_response = response.text.replace("```json", "").replace("```", "").strip()
            data = json.loads(text_response)
            return data
        except Exception as e:
            print(f"Error extracting concepts: {e}")
            return {
                "nodes": [{"id": "Error", "group": 1}],
                "links": []
            }
