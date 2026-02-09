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
  structuralDamage: number; 
  fireHazard: number;       
  humanDanger: number;      
}

// Gemini 分析後的完整結果
export interface AnalysisResult {
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW' | 'STANDBY' | 'ANALYZING'
  confidence: number;
  timestamp: string;
  location: Location;
  situationSummary: string;   
  situationSummaryZh: string; 
  riskFactors: RiskFactors;
  suggestedTasks: Task[];
}

// 表單資料結構
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
  level: 'WARNING' | 'EMERGENCY';
  title: string;
  titleZh: string;
  message: string;
  messageZh: string;
  timestamp: string;
  // [新增] 災害地點與影響半徑 (公里)
  location?: { lat: number, lng: number }; 
  radiusKm?: number; 
}

// 聊天視窗用的訊息格式
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  attachmentUrl?: string; 
  analysis?: AnalysisResult; 
  interactive?: 'choice' | 'form' | 'form_submitted'; 
  formData?: ReportingFormData;
}
