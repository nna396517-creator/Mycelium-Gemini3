// src/data/demoScenarios.ts
import { AnalysisResult } from '@/lib/types';

export const SCENARIO_DATABASE: Record<string, AnalysisResult> = {
  
  // 🔥 火災場景
  'fire': {
    riskLevel: 'CRITICAL',
    confidence: 0.98,
    timestamp: new Date().toISOString(),
    location: { lat: 25.04, lng: 121.50 },
    situationSummary: "**🔥 FIRE HAZARD DETECTED**\n\nAnalysis indicates a large-scale industrial/residential fire. Thermal signatures suggest temperatures exceeding 800°C. \n\n**Hazards:**\n- Toxic smoke dispersion (Check wind direction).\n- Potential structural weakening due to heat.\n- Explosion risk if chemical storage is present.",
    situationSummaryZh: "**🔥 偵測到嚴重火災**\n\n分析顯示大規模工業/住宅火災。熱訊號顯示溫度超過 800°C。\n\n**危險評估：**\n- 有毒濃煙擴散（請即時確認風向）。\n- 高溫可能導致建築結構脆弱化。\n- 若現場存有化學物品，具高度爆炸風險。",
    riskFactors: {
      structuralDamage: 65,
      humanDanger: 90,
      fireHazard: 98
    },
    suggestedTasks: [
      { 
        id: 'f1', role: 'RESCUER', description: 'Establish 500m exclusion zone immediately.', priority: 'HIGH', status: 'pending',
        coordinates: { lat: 25.041, lng: 121.501 } 
      },
      { 
        id: 'f2', role: 'MEDIC', description: 'Prepare burn unit & O2 therapy for smoke inhalation.', priority: 'HIGH', status: 'pending',
        coordinates: { lat: 25.039, lng: 121.499 }
      },
      { 
        id: 'f3', role: 'SUPPLY', description: 'Deploy water tankers and foam concentrate.', priority: 'MEDIUM', status: 'pending',
        coordinates: { lat: 25.042, lng: 121.502 }
      }
    ]
  },

  // 🏚️ 地震/建築倒塌
  'earthquake': {
    riskLevel: 'CRITICAL',
    confidence: 0.95,
    timestamp: new Date().toISOString(),
    location: { lat: 23.97, lng: 121.60 },
    situationSummary: "**🏚️ STRUCTURAL COLLAPSE DETECTED**\n\nImage confirms major structural failure (Pancake Collapse). Multiple floors compressed. High probability of trapped civilians in voids.\n\n**Critical Analysis:**\n- Unstable debris pile.\n- Secondary collapse risk from aftershocks.\n- Heavy machinery required for lifting.",
    situationSummaryZh: "**🏚️ 偵測到結構倒塌**\n\n影像確認發生重大結構破壞（平底鍋式倒塌）。多樓層擠壓，空隙中極可能有人員受困。\n\n**關鍵分析：**\n- 瓦礫堆結構極不穩定。\n- 餘震可能導致二次倒塌風險。\n- 極需重型機具進行吊掛作業。",
    riskFactors: {
      structuralDamage: 99,
      humanDanger: 95,
      fireHazard: 30
    },
    suggestedTasks: [
      { 
        id: 'e1', role: 'RESCUER', description: 'Deploy K-9 Search Unit & Life Detectors.', priority: 'HIGH', status: 'pending',
        coordinates: { lat: 23.971, lng: 121.601 }
      },
      { 
        id: 'e2', role: 'HEAVY', description: 'Mobilize cranes/excavators for debris removal.', priority: 'HIGH', status: 'pending',
        coordinates: { lat: 23.969, lng: 121.599 }
      },
      { 
        id: 'e3', role: 'MEDIC', description: 'Set up Triage Area (Green/Yellow/Red zones).', priority: 'HIGH', status: 'pending',
        coordinates: { lat: 23.972, lng: 121.602 }
      }
    ]
  },
  
  // 道路龜裂
  'crack': {
    riskLevel: 'HIGH',
    confidence: 0.92,
    timestamp: new Date().toISOString(),
    location: { lat: 23.97, lng: 121.60 },
    situationSummary: "**🚧 INFRASTRUCTURE DAMAGE**\n\nSevere road buckling and liquefaction detected. Main arterial route is impassable.\n\n**Impact:**\n- Logistics supply chain cut off.\n- Ambulance route obstruction.\n- Potential sinkhole formation.",
    situationSummaryZh: "**🚧 基礎設施嚴重損壞**\n\n偵測到道路嚴重隆起與土壤液化。主要幹道已無法通行。\n\n**影響評估：**\n- 物資供應鏈將被切斷。\n- 救護車通行受阻，需改道。\n- 潛在的天坑形成風險。",
    riskFactors: {
      structuralDamage: 80,
      humanDanger: 40,
      fireHazard: 0
    },
    suggestedTasks: [
      { 
        id: 'c1', role: 'SUPPLY', description: 'Reroute all incoming relief traffic to Alt Route B.', priority: 'HIGH', status: 'pending',
        coordinates: { lat: 23.975, lng: 121.605 }
      },
      { 
        id: 'c2', role: 'HEAVY', description: 'Deploy temporary bridge layer (AVLB).', priority: 'MEDIUM', status: 'pending',
        coordinates: { lat: 23.965, lng: 121.595 }
      },
      { 
        id: 'c3', role: 'RESCUER', description: 'Cordon off 100m radius around fissures.', priority: 'MEDIUM', status: 'pending',
        coordinates: { lat: 23.970, lng: 121.600 }
      }
    ]
  },

  // 🌊 水災
  'flood': {
    riskLevel: 'HIGH',
    confidence: 0.96,
    timestamp: new Date().toISOString(),
    location: { lat: 22.62, lng: 120.30 },
    situationSummary: "**🌊 SEVERE FLOODING**\n\nWater level estimated at 80-120cm (Waist to Chest deep). Vehicles submerged and residents trapped in low-lying areas.\n\n**Hazards:**\n- Drowning risk.\n- Electrical shock from submerged infrastructure.\n- Hypothermia.",
    situationSummaryZh: "**🌊 嚴重淹水警報**\n\n估計水位達 80-120 公分（及腰至及胸深度）。車輛遭滅頂，居民受困於低窪地區。\n\n**危險評估：**\n- 高度溺水風險。\n- 淹水設施可能導致觸電。\n- 長時間浸泡導致失溫。",
    riskFactors: {
      structuralDamage: 40,
      humanDanger: 88,
      fireHazard: 10
    },
    suggestedTasks: [
      { 
        id: 'w1', role: 'RESCUER', description: 'Deploy Zodiac boats for extraction.', priority: 'HIGH', status: 'pending',
        coordinates: { lat: 22.622, lng: 120.302 }
      },
      { 
        id: 'w2', role: 'SUPPLY', description: 'Airdrop food/water to isolated rooftops.', priority: 'MEDIUM', status: 'pending',
        coordinates: { lat: 22.618, lng: 120.298 }
      },
      { 
        id: 'w3', role: 'RESCUER', description: 'Cut power grid in Sector 4 to prevent electrocution.', priority: 'HIGH', status: 'pending',
        coordinates: { lat: 22.625, lng: 120.305 }
      }
    ]
  },

  // 🏥 救援/志工
  'rescue': {
    riskLevel: 'MODERATE',
    confidence: 0.90,
    timestamp: new Date().toISOString(),
    location: { lat: 24.14, lng: 120.68 },
    situationSummary: "**🤝 RELIEF OPERATIONS ACTIVE**\n\nCivilian volunteers and rescue teams identified. Evacuation and supply distribution in progress.\n\n**Status:**\n- Manpower sufficient.\n- Coordination required to prevent bottleneck.",
    situationSummaryZh: "**🤝 救援行動進行中**\n\n識別出民間志工與救援隊伍。疏散與物資分發正在有序進行中。\n\n**狀態：**\n- 現場人力充足。\n- 需加強協調以防止動線堵塞。",
    riskFactors: {
      structuralDamage: 20,
      humanDanger: 30,
      fireHazard: 0
    },
    suggestedTasks: [
      { 
        id: 'r1', role: 'SUPPLY', description: 'Coordinate civilian supply drop-off points.', priority: 'MEDIUM', status: 'pending',
        coordinates: { lat: 24.142, lng: 120.682 }
      },
      { 
        id: 'r2', role: 'MEDIC', description: 'Monitor fatigue levels of rescue personnel.', priority: 'LOW', status: 'pending',
        coordinates: { lat: 24.138, lng: 120.678 }
      }
    ]
  }
};

// 預設劇本
export const DEFAULT_SCENARIO: AnalysisResult = {
  riskLevel: 'ANALYZING',
  confidence: 0.0,
  timestamp: new Date().toISOString(),
  location: { lat: 0, lng: 0 },
  situationSummary: "Processing image data...",
  situationSummaryZh: "正在處理影像數據...",
  riskFactors: { structuralDamage: 0, humanDanger: 0, fireHazard: 0 },
  suggestedTasks: []
};
