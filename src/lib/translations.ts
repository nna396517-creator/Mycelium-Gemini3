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
        calcWeights: "計算權重",
        resources: "分散式資源節點 (AVAILABLE)",
        medic: "醫療救援組 (Medic)",
        supply: "物資補給 (Supply)",
        heavy: "重型機具 (Heavy)"
    },
    // 圖表事件翻譯
    chart: {
        patrol: "例行巡邏",
        vibration: "輕微震動",
        clear: "區域安全",
        smoke: "偵測到煙霧",
        falseAlarm: "誤報",
        aftershock: "餘震警報",
        structure: "結構檢查",
        collapse: "B區坍塌",
        rescue: "救援隊抵達",
        gas: "偵測到瓦斯外洩",
        critical: "偵測到嚴重損傷"
    },
    chat: {
        welcome: "Gemini 3 災難韌性系統已連線。\n請上傳現場影像以開始分析。",
        analyzing: "Gemini 3 正在進行多模態推理...",
        upload: "上傳影像",
        placeholder: "輸入現場指令...",
        userPrompt: "分析此區域災情，並分派任務。",
        clearHistory: "清除對話紀錄",
        historyCleared: "紀錄已清除"
    },
    map: {
        offline: "離線地圖模式"
    },
    auth: {
      title: "身份驗證",
      subtitle: "請連接 Mycelium 安全節點以存取指揮權限",
      connect: "建立安全連線",
      verifying: "正在驗證生物識別...",
      success: "授權通過",
      idPlaceholder: "輸入指揮官 ID (提示: admin)",
      error: "拒絕存取：無效的憑證"
    },
    user: {
      role: "指揮官",
      logout: "登出系統"
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
        calcWeights: "CALCULATED WEIGHTS",
        resources: "AVAILABLE RESOURCES",
        medic: "Medical Units",
        supply: "Supply Units",
        heavy: "Heavy Machinery"
    },
    // Chart events
    chart: {
        patrol: "Routine Patrol",
        vibration: "Minor Vibrations",
        clear: "All Clear",
        smoke: "Smoke Detected",
        falseAlarm: "False Alarm",
        aftershock: "Aftershock Warning",
        structure: "Structural Check",
        collapse: "Sector B Collapse",
        rescue: "Rescue Team Arrival",
        gas: "Gas Leak Detected",
        critical: "Critical Damage Detected"
    },
    chat: {
        welcome: "Gemini 3 System Connected.\nPlease upload scene imagery to begin analysis.",
        analyzing: "Gemini 3 Multimodal Reasoning...",
        upload: "Upload Image",
        placeholder: "Enter command...",
        userPrompt: "Analyze this area and assign tasks.",
        clearHistory: "Clear History",
        historyCleared: "History Cleared"
    },
    map: {
        offline: "OFFLINE MAP"
    },
    auth: {
      title: "IDENTITY VERIFICATION",
      subtitle: "Connect to Mycelium Secure Node for Command Access",
      connect: "ESTABLISH CONNECTION",
      verifying: "Verifying Biometrics...",
      success: "ACCESS GRANTED",
      idPlaceholder: "Enter Commander ID (Hint: admin)",
      error: "ACCESS DENIED: INVALID CREDENTIALS"
    },
    user: {
      role: "COMMANDER",
      logout: "LOGOUT SYSTEM"
    }
  }
};
