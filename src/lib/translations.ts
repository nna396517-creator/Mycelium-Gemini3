// src/lib/translations.ts

export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    header: {
      title: "Mycelium 菌絲體網絡",
      subtitle: "Gemini 3 分散式韌性系統 | 連線穩定",
      status: "系統連線中"
    },
    stats: {
      latency: "延遲",
      risk: "區域風險指數",
      resources: "分散式資源節點 (AVAILABLE)",
      medic: "醫療救援組 (Medic)",
      supply: "物資補給 (Supply)",
      heavy: "重型機具 (Heavy)"
    },
    chat: {
      welcome: "Gemini 3 災難韌性系統已連線。\n請上傳現場影像以開始分析。",
      analyzing: "Gemini 3 正在進行多模態推理...",
      upload: "上傳影像",
      placeholder: "輸入現場指令...",
      userPrompt: "分析此區域災情，並分派任務。"
    },
    map: {
      offline: "離線地圖模式"
    }
  },
  en: {
    header: {
      title: "Mycelium Network",
      subtitle: "Gemini 3 Distributed Resilience | Stable",
      status: "SYSTEM ONLINE"
    },
    stats: {
      latency: "LATENCY",
      risk: "LOCAL RISK INDEX",
      resources: "AVAILABLE RESOURCES",
      medic: "Medical Units",
      supply: "Supply Units",
      heavy: "Heavy Machinery"
    },
    chat: {
      welcome: "Gemini 3 System Connected.\nPlease upload scene imagery to begin analysis.",
      analyzing: "Gemini 3 Multimodal Reasoning...",
      upload: "Upload Image",
      placeholder: "Enter command...",
      userPrompt: "Analyze this area and assign tasks."
    },
    map: {
      offline: "OFFLINE MAP"
    }
  }
};
