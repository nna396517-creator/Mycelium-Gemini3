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

// 定義三個維度的評分因子
export interface RiskFactors {
  structuralDamage: number; // 結構受損度 (0-100)
  fireHazard: number;       // 火災/爆炸風險 (0-100)
  humanDanger: number;      // 人員受困危急度 (0-100)
}

// Gemini 分析後的完整結果
export interface AnalysisResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;        // 最終加權分數 (0-100)
  riskFactors: RiskFactors; // 詳細評分
  situationSummary: string;
  suggestedTasks: Task[];
  coordinates: { lat: number; lng: number };
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
