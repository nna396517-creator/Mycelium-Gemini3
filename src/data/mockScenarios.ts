// src/data/mockScenarios.ts
import { AnalysisResult } from "@/lib/types";

export const DEMO_SCENARIO: AnalysisResult = {
  timestamp: new Date().toISOString(),
  riskLevel: "CRITICAL",
  situationSummary: "【AI 視覺分析】偵測到規模 6.5 強震導致建築結構嚴重受損。熱感應顯示 3 樓有生命跡象反應，但該區瓦斯管線破裂，有起火風險。",
  requiredResources: ["生命探測儀", "消防車 (泡沫式)", "支撐結構組"],
  suggestedTasks: [
    {
      id: "t-1",
      role: "RESCUER",
      description: "進入林森北路 107 號 3F 搜索受困者",
      priority: 1,
      targetLocation: { lat: 25.0478, lng: 121.5170 }, // 台北車站附近
      status: "PENDING"
    },
    {
      id: "t-2",
      role: "SUPPLY",
      description: "封鎖周邊 50 公尺並切斷瓦斯",
      priority: 1,
      targetLocation: { lat: 25.0480, lng: 121.5175 },
      status: "IN_PROGRESS"
    },
    {
      id: "t-3",
      role: "MEDIC",
      description: "於全家便利商店前建立檢傷分類站",
      priority: 2,
      targetLocation: { lat: 25.0475, lng: 121.5165 },
      status: "PENDING"
    }
  ]
};
