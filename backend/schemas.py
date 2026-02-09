from pydantic import BaseModel
from typing import List, Optional, Dict

class Coordinate(BaseModel):
    lat: float
    lng: float

class MapUpdate(BaseModel):
    volunteer_id: str
    name: str
    role: str
    status: str
    action: str
    current_location: Coordinate
    target_location: Optional[Coordinate] = None
    path_color: str

class AIAnalysisResult(BaseModel):
    severity_score: int
    risk_assessment: str
    reasoning_log: str
    action_plan: str

class DisasterResponse(BaseModel):
    status: str
    timestamp: str
    ai_analysis: AIAnalysisResult
    map_updates: List[MapUpdate]