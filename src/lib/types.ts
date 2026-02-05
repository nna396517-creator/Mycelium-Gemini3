// src/lib/types.ts

// 災難風險等級
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

// 座標介面
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

// 任務角色
export type TaskRole = 'MEDIC' | 'RESCUER' | 'SUPPLY' | 'COMMANDER';

// 具體任務內容
export interface Task {
  id: string;
  role: TaskRole;
  description: string;
  priority: number; // 1 (最高) - 5 (最低)
  targetLocation: Location;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

// Gemini 分析後的完整結果
export interface AnalysisResult {
  riskLevel: RiskLevel;
  situationSummary: string; // 例如："畫面顯示建築物結構受損，有人員受困..."
  requiredResources: string[]; // ["水", "醫療包", "大型機具"]
  suggestedTasks: Task[];
  timestamp: string;
}

// 聊天視窗用的訊息格式
export interface Message {
  id: string;
  role: 'user' | 'system' | 'assistant';
  content: string;
  attachmentUrl?: string; // 圖片的 URL
  analysis?: AnalysisResult; // 如果這則訊息是 AI 分析結果，會帶有此欄位
  isThinking?: boolean; // UI 顯示 loading 狀態用
}
