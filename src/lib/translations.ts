// src/lib/translations.ts

export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    // ... (原本的 header, stats 維持不變)
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
    // ... (原本的 chat, map 維持不變)
    chat: {
        welcome: "Gemini 3 災難韌性系統已連線。\n請上傳現場影像以開始分析。",
        analyzing: "Gemini 3 正在進行多模態推理...",
        upload: "上傳影像",
        placeholder: "輸入現場指令...",
        userPrompt: "分析此區域災情，並分派任務。"
    },
    map: {
        offline: "離線地圖模式"
    },
    // [新增] 登入相關文字
    auth: {
      title: "身份驗證",
      subtitle: "請連接 Mycelium 安全節點以存取指揮權限",
      connect: "建立安全連線",
      verifying: "正在驗證生物識別...",
      success: "授權通過",
      idPlaceholder: "輸入指揮官 ID / 存取金鑰"
    }
  },
  en: {
    // ... (Original header, stats)
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
    // ... (Original chat, map)
    chat: {
        welcome: "Gemini 3 System Connected.\nPlease upload scene imagery to begin analysis.",
        analyzing: "Gemini 3 Multimodal Reasoning...",
        upload: "Upload Image",
        placeholder: "Enter command...",
        userPrompt: "Analyze this area and assign tasks."
    },
    map: {
        offline: "OFFLINE MAP"
    },
    // [New] Auth related texts
    auth: {
      title: "IDENTITY VERIFICATION",
      subtitle: "Connect to Mycelium Secure Node for Command Access",
      connect: "ESTABLISH CONNECTION",
      verifying: "Verifying Biometrics...",
      success: "ACCESS GRANTED",
      idPlaceholder: "Enter Commander ID / Access Key"
    }
  }
};
