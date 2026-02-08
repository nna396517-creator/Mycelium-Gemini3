// src/data/mockScenarios.ts

import { AnalysisResult } from "@/lib/types";

export const DEMO_SCENARIO: AnalysisResult = {
  timestamp: new Date().toISOString(),
  riskLevel: "CRITICAL",
  situationSummary:
    "[AI Vision Analysis] A magnitude 6.5 strong earthquake has been detected, causing severe structural damage to the building. Thermal imaging indicates signs of life on the 3rd floor; however, a ruptured gas pipeline in the area poses a fire hazard.",
  requiredResources: [
    "Life Detection Device",
    "Fire Truck (Foam Type)",
    "Structural Support Unit"
  ],
  suggestedTasks: [
    {
      id: "t-1",
      role: "RESCUER",
      description: "Enter 3F, No. 107, Linsen North Road to search for trapped individuals",
      priority: 1,
      targetLocation: { lat: 25.0478, lng: 121.5170 }, // Near Taipei Main Station
      status: "PENDING"
    },
    {
      id: "t-2",
      role: "SUPPLY",
      description: "Establish a 50-meter perimeter and shut off the gas supply",
      priority: 1,
      targetLocation: { lat: 25.0480, lng: 121.5175 },
      status: "IN_PROGRESS"
    },
    {
      id: "t-3",
      role: "MEDIC",
      description: "Set up a triage station in front of the FamilyMart convenience store",
      priority: 2,
      targetLocation: { lat: 25.0475, lng: 121.5165 },
      status: "PENDING"
    }
  ]
};

/*import { AnalysisResult } from "@/lib/types";

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
*/
