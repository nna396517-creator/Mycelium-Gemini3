// src/app/api/analyze/route.ts
import { NextResponse } from 'next/server';

// 定義回傳給前端的資料結構 (與 src/lib/types.ts 保持一致)
interface AnalysisResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  riskFactors: {
    structuralDamage: number;
    fireHazard: number;
    humanDanger: number;
  };
  situationSummary: string;
  suggestedTasks: Array<{
    id: string;
    role: 'MEDIC' | 'RESCUER' | 'SUPPLY';
    description: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    coordinates: { lat: number; lng: number };
  }>;
  coordinates: { lat: number; lng: number };
}

export async function POST(request: Request) {
  try {
    // 1. 接收前端傳來的 FormData (雖然目前 Mock 模式用不到圖片，但先寫好接收邏輯)
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    console.log(`[Server] Received image: ${file.name}, size: ${file.size}`);

    // ============================================================
    // ⚠️ MOCK MODE (因為還沒有 API Key，我們先模擬 AI 的思考過程)
    // ============================================================
    
    // 模擬 AI 處理延遲 (1.5秒)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 模擬 Gemini 分析出來的原始數據 (這部分未來會換成真的 AI 回傳值)
    const mockAiFactors = {
      structuralDamage: 85, // 結構受損嚴重
      fireHazard: 30,       // 有些微火光
      humanDanger: 60,      // 有人受困
      summary: "Detected severe structural collapse with potential trapped survivors. Minor fire hazard observed in the west wing."
    };

    // 2. 執行權重計算公式：人命(0.5) > 結構(0.3) > 火災(0.2)
    const weightedScore = Math.round(
      (mockAiFactors.structuralDamage * 0.3) +
      (mockAiFactors.fireHazard * 0.2) +
      (mockAiFactors.humanDanger * 0.5)
    );

    // 3. 根據分數決定風險等級
    let level: AnalysisResult['riskLevel'] = 'LOW';
    if (weightedScore > 80) level = 'CRITICAL';
    else if (weightedScore > 50) level = 'HIGH';
    else if (weightedScore > 20) level = 'MEDIUM';

    // 4. 準備回傳給前端的完整 JSON
    const responseData: AnalysisResult = {
      riskLevel: level,
      riskScore: weightedScore,
      riskFactors: {
        structuralDamage: mockAiFactors.structuralDamage,
        fireHazard: mockAiFactors.fireHazard,
        humanDanger: mockAiFactors.humanDanger
      },
      situationSummary: mockAiFactors.summary,
      // 模擬指派任務
      suggestedTasks: [
        {
          id: 't-1',
          role: 'RESCUER',
          description: 'Structural reinforcement team required at sector A.',
          priority: 'HIGH',
          coordinates: { lat: 25.034, lng: 121.564 } // 範例座標
        },
        {
          id: 't-2',
          role: 'MEDIC',
          description: 'Prepare triage unit for potential survivors.',
          priority: 'HIGH',
          coordinates: { lat: 25.0345, lng: 121.5645 }
        }
      ],
      coordinates: { lat: 25.0330, lng: 121.5654 } // 範例中心點
    };

    // 回傳成功 (200 OK)
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
