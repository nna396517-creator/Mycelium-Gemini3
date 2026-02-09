from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from services import analyze_disaster_scenario

load_dotenv()

app = FastAPI(title="Mycelium Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"status": "operational", "system": "Mycelium Disaster Network"}

@app.post("/api/analyze")
async def analyze_endpoint(
    image: UploadFile = File(...),
    audio_transcript: str = Form(default="Help! Gas leak!")
):
    content = await image.read()
    result = await analyze_disaster_scenario(content, image.content_type, audio_transcript)
    return result

if __name__ == "__main__":
    import uvicorn
    import os
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))