from fastapi import FastAPI

app = FastAPI(title="Learning Summarizer API")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Learning Summarizer API is running"}
