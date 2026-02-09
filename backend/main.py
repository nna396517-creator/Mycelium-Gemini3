# backend/main.py
from dotenv import load_dotenv
import os

# --- 除錯區塊開始 ---
print(f"目前工作目錄: {os.getcwd()}")
is_loaded = load_dotenv() # 嘗試載入 .env
print(f".env 檔案是否載入成功? {is_loaded}")
api_key = os.getenv("GEMINI_API_KEY")
print(f"讀取到的 API Key: {api_key[:5] + '...' if api_key else 'None'}")
# --- 除錯區塊結束 ---

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from services import analyze_disaster_scenario

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
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
