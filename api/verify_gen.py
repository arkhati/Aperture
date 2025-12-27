import asyncio
import os
from dotenv import load_dotenv
import sys
sys.path.append(os.getcwd()) # Add current dir to path
from api.services.script_generator import ScriptGenerator

async def test():
    load_dotenv()
    if not os.getenv("GEMINI_API_KEY"):
        print("No API Key found!")
        return

    print("Testing Gemini 2.0 Flash-Lite...")
    generator = ScriptGenerator()
    try:
        script = await generator.generate_script("Explain quantum physics in 10 words.")
        print("Success! Generation worked.")
        print(script)
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test())
