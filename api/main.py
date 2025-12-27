from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Learning Summarizer API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os

# Mount static directory for audio files
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True) # Ensure it exists
app.mount("/static", StaticFiles(directory=static_dir), name="static")

class TextRequest(BaseModel):
    text: str
    mode: str = "podcast" # podcast, wordweb, bookmap

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Learning Summarizer API is running"}

from pypdf import PdfReader
from io import BytesIO

async def process_content(text: str, mode: str):
    """Shared logic to process text based on mode"""
    if mode == "podcast":
        # 1. Generate Script
        from api.services.script_generator import ScriptGenerator
        script_gen = ScriptGenerator()
        script = await script_gen.generate_script(text)
        
        # 2. Generate Audio
        from api.services.audio_generator import AudioGenerator
        audio_gen = AudioGenerator()
        filename = await audio_gen.generate_audio(script)
        
        audio_url = f"http://localhost:8000/static/audio/{filename}"

        return {
            "status": "success",
            "message": "Podcast generated successfully",
            "data": {
                "script": script,
                "audio_url": audio_url
            }
        }
    
    elif mode == "wordweb":
        from api.services.concept_extractor import ConceptExtractor
        extractor = ConceptExtractor()
        graph_data = await extractor.extract_concepts(text)
        
        return {
            "status": "success",
            "message": "WordWeb graph generated",
            "data": {"graph": graph_data}
        }

    elif mode == "bookmap":
        from api.services.narrative_extractor import NarrativeExtractor
        extractor = NarrativeExtractor()
        timeline = await extractor.extract_narrative(text)
            
        return {
            "status": "success",
            "message": "BookMap timeline generated",
            "data": {"timeline": timeline}
        }
        
    return {
        "status": "error",
        "message": f"Unknown mode: {mode}"
    }

@app.post("/process-text")
async def process_text(request: TextRequest):
    return await process_content(request.text, request.mode)

@app.post("/process-file")
async def process_file(file: UploadFile = File(...), mode: str = Form("podcast")):
    content = ""
    
    try:
        if file.filename.lower().endswith(".pdf"):
            # Read PDF
            pdf_bytes = await file.read()
            pdf_file = BytesIO(pdf_bytes)
            reader = PdfReader(pdf_file)
            content = "\\n".join([page.extract_text() for page in reader.pages])
            
        elif file.filename.lower().endswith(".txt") or file.filename.lower().endswith(".md"):
            # Read Text
            content_bytes = await file.read()
            content = content_bytes.decode("utf-8")
            
        else:
             return {
                "status": "error",
                "message": f"Unsupported file type: {file.filename}. Please use .txt or .pdf"
            }
            
        if not content:
             return {
                "status": "error",
                "message": "Could not extract text from file."
            }
            
        return await process_content(content, mode)

    except Exception as e:
        print(f"Error processing file: {e}")
        return {
            "status": "error",
            "message": f"Error processing file: {str(e)}"
        }

