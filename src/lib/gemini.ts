// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// 確保有抓到環境變數，不然在開發時就報錯提醒
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ Warning: GOOGLE_GEMINI_API_KEY is not defined in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey || "MOCK_KEY");

// 設定 Gemini 3 的模型 (如果 API 還沒開放 1.5/3，先用 gemini-pro-vision 測試)
// Hackathon 說明應該有指定 model name，請工程師確認
export const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash-latest" // 或 "gemini-pro-vision"
});

export default genAI;
