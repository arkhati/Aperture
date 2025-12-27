import edge_tts
import os
import uuid

# Voice configuration for the two hosts
VOICE_MAPPING = {
    "Host 1": "en-US-AndrewNeural", # Male, clear, explanatory
    "Host 2": "en-US-AvaNeural",    # Female, curious, conversational
}

class AudioGenerator:
    def __init__(self, output_dir: str = None):
        if output_dir is None:
             # Resolve absolute path to api/static/audio
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            self.output_dir = os.path.join(base_dir, "static", "audio")
        else:
            self.output_dir = output_dir
            
        os.makedirs(self.output_dir, exist_ok=True)

    async def generate_audio(self, script: list) -> str:
        """
        Generates audio for the script and returns the filename.
        """
        # Generate a unique filename for this session
        filename = f"podcast_{uuid.uuid4()}.mp3"
        output_path = os.path.join(self.output_dir, filename)
        
        # We will write all audio segments to a single file sequentially
        # simpler than using ffmpeg/pydub for now, we just concat bytes
        
        with open(output_path, "wb") as final_file:
            for item in script:
                speaker = item.get("speaker", "Host 1")
                text = item.get("text", "")
                
                # Default to Host 1 voice if speaker unknown
                voice = VOICE_MAPPING.get(speaker, VOICE_MAPPING["Host 1"])
                
                # Generate audio segment for this line
                communicate = edge_tts.Communicate(text, voice)
                
                # Stream the audio to the file
                async for chunk in communicate.stream():
                    if chunk["type"] == "audio":
                        final_file.write(chunk["data"])
                        
        return filename
