// src/lib/translations.ts

export type Language = 'zh' | 'en';

export const translations = {
  zh: {
    header: {
        title: "Mycelium",
        subtitle: "Gemini 3 分散式韌性系統 | 連線穩定",
        status: "系統連線中"
    },
    stats: {
        latency: "網速延遲",
        risk: "區域風險指數",
        calcWeights: "計算權重",
        resources: "分散式資源節點 (AVAILABLE)",
        medic: "醫療救援組 (Medic)",
        supply: "物資補給 (Supply)",
        heavy: "重型機具 (Heavy)"
    },
    // 地圖圖例翻譯
    legend: {
      title: "圖例說明",
      user: "當前位置",
      aed: "AED 急救點",
      hospital: "急救醫院",
      shelter: "避難收容所",
      bunker: "防空避難處",
      task: "救援任務"
    },
    // 警報翻譯
    alerts: {
      typhoonTitle: "海上陸上颱風警報",
      typhoonMsg: "強烈颱風接近中。預計 2 小時後進入暴風圈，請立即做好防颱準備。",
      quakeTitle: "地震速報",
      quakeMsg: "偵測到區域性顯著有感地震。預估震度 5 弱。請立即趴下、掩護、穩住。",
      airRaidTitle: "防空警報 (萬安演習)",
      airRaidMsg: "飛彈空襲警報。請所有人員立即進入避難所掩蔽。非演習。",
      dismiss: "確認收到"
    },
    // 氣象卡片翻譯
    weather: {
        title: "即時氣象監測",
        temp: "氣溫",
        humidity: "濕度",
        wind: "風速",
        precip: "降雨機率",
        conditions: {
            sunny: "烈日 / 高溫",
            cloudy: "多雲 / 陰",
            rainy: "豪雨特報",
            storm: "雷雨交加",
            clear: "晴朗"
        }
    },
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
    suggested: {
        cprLabel: "🚑 CPR 急救教學",
        cprValue: "請教我 CPR 心肺復甦術的步驟",
        fireLabel: "🔥 滅火器用法",
        fireValue: "滅火器該怎麼使用？",
        quakeLabel: "🏚️ 地震避難",
        quakeValue: "地震發生時我該躲哪裡？",
        floodLabel: "🌊 水災應變",
        floodValue: "淹水時的緊急應變措施",
        kitLabel: "🎒 避難包清單",
        kitValue: "緊急避難包裡面要放什麼？"
    },
    reporting: {
        choiceTitle: "系統已接收影像。請選擇操作：",
        btnReport: "📢 即時災情回報",
        btnConsult: "🤖 應變建議諮詢",
        formTitle: "災情通報單",
        location: "地理位置",
        getLocation: "取得現在位置",
        locating: "定位中...",
        damageItem: "受損項目",
        damageOptions: {
            residential: "住宅",
            public: "公共建物",
            terrain: "地形 (土石流/崩塌)",
            coast: "海岸或河口",
            road: "道路",
            transport: "交通運輸設施"
        },
        disasterType: "災害類型",
        disasterOptions: {
            fire: "火災",
            flood: "水災",
            other: "其他現象"
        },
        desc: "補充說明 (Optional)",
        needs: "物資或支援需求 (Optional)",
        submit: "提交回報",
        submitted: "✅ 災情已登錄至 Mycelium 網絡",
        errorLocation: "⚠️ 請點擊「取得現在位置」以填入座標",
        aiFollowUp: "收到，已將您的回報資訊登錄至指揮中心。\n\n**請問您目前是否還需要其他緊急協助？** (例如：急救指南、避難所位置)"
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
        title: "Mycelium",
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
    // Legend translation
    legend: {
      title: "Map Legend",
      user: "Current Loc",
      aed: "AED",
      hospital: "Hospital",
      shelter: "Shelter",
      bunker: "Air Raid",
      task: "Mission"
    },
    // Alert translations
    alerts: {
      typhoonTitle: "Typhoon Warning",
      typhoonMsg: "Severe Typhoon Approaching. Expected impact in 2 hours. Initiate protocol.",
      quakeTitle: "Earthquake Early Warning",
      quakeMsg: "Significant seismic activity detected. Est. Intensity 5. DROP, COVER, HOLD ON.",
      airRaidTitle: "Air Raid Siren",
      airRaidMsg: "Incoming Missile Threat Detected. Seek immediate shelter. THIS IS NOT A DRILL.",
      dismiss: "Acknowledge"
    },
    // Weather translations
    weather: {
        title: "REAL-TIME WEATHER",
        temp: "Temp",
        humidity: "Humidity",
        wind: "Wind",
        precip: "Precip",
        conditions: {
            sunny: "Sunny / High Heat",
            cloudy: "Cloudy / Overcast",
            rainy: "Heavy Rain Alert",
            storm: "Thunderstorm",
            clear: "Clear Sky"
        }
    },
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
    suggested: {
        cprLabel: "🚑 CPR Guide",
        cprValue: "How to perform CPR step-by-step?",
        fireLabel: "🔥 Extinguisher",
        fireValue: "How to use a fire extinguisher?",
        quakeLabel: "🏚️ Earthquake",
        quakeValue: "Where to hide during an earthquake?",
        floodLabel: "🌊 Flood Response",
        floodValue: "Emergency measures for flooding",
        kitLabel: "🎒 Emergency Kit",
        kitValue: "What should be in an emergency kit?"
    },
    reporting: {
        choiceTitle: "Image received. Please select action:",
        btnReport: "📢 Real-time Reporting",
        btnConsult: "🤖 Response Consultation",
        formTitle: "Disaster Report Form",
        location: "Location",
        getLocation: "Get Current GPS",
        locating: "Locating...",
        damageItem: "Damage Item",
        damageOptions: {
            residential: "Residential",
            public: "Public Building",
            terrain: "Terrain/Landslide",
            coast: "Coast/Estuary",
            road: "Road",
            transport: "Transport Facility"
        },
        disasterType: "Disaster Type",
        disasterOptions: {
            fire: "Fire",
            flood: "Flood",
            other: "Other"
        },
        desc: "Description (Optional)",
        needs: "Supplies/Support Needs (Optional)",
        submit: "Submit Report",
        submitted: "✅ Report Logged to Mycelium Network",
        errorLocation: "⚠️ Please click 'Get Current GPS' to set location",
        aiFollowUp: "Received. Your report has been logged to the Command Center.\n\n**Do you need any further assistance?** (e.g., First Aid Guide, Shelter Locations)"
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
