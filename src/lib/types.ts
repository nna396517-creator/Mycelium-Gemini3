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
  role: 'RESCUER' | 'MEDIC' | 'SUPPLY' | 'HEAVY';
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'pending' | 'active' | 'completed';
  coordinates?: Location;
}

// 定義三個維度的評分因子
export interface RiskFactors {
  structuralDamage: number; // 結構受損度 (0-100)
  fireHazard: number;       // 火災/爆炸風險 (0-100)
  humanDanger: number;      // 人員受困危急度 (0-100)
}

// Gemini 分析後的完整結果
export interface AnalysisResult {
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'STANDBY' | 'ANALYZING'
  confidence: number;
  timestamp: string;
  location: Location;
  situationSummary: string;   // 英文版摘要
  situationSummaryZh: string; // 中文版摘要
  riskFactors: RiskFactors;
  suggestedTasks: Task[];
}

// [新增] 表單資料結構
export interface ReportingFormData {
  location?: { lat: number, lng: number };
  damageItem?: string;
  disasterType?: string;
  description?: string;
  needs?: string;
}

// 緊急警報類型
export type AlertType = 'TYPHOON' | 'EARTHQUAKE' | 'AIR_RAID' | 'MISSILE';

export interface EmergencyAlert {
  id: string;
  type: AlertType;
  level: 'WARNING' | 'EMERGENCY'; // 警報等級
  title: string;
  titleZh: string;
  message: string;
  messageZh: string;
  timestamp: string;
}

// 聊天視窗用的訊息格式
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachmentUrl?: string; // 圖片的 URL
  analysis?: AnalysisResult; // AI 分析結果
  
  // [新增] 互動模式屬性
  interactive?: 'choice' | 'form' | 'form_submitted'; 
  // 用於暫存該則訊息的表單狀態 (僅前端顯示用)
  formData?: ReportingFormData;
}
