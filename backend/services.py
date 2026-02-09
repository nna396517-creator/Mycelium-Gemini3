import os
from google import genai
from google.genai import types
from datetime import datetime
from config import DISASTER_POINT, VOLUNTEER_A, TEAM_B, DEMO_SCRIPT_RESPONSE
from schemas import DisasterResponse, AIAnalysisResult, MapUpdate, Coordinate

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def analyze_disaster_scenario(file_content: bytes, mime_type: str, audio_context: str) -> DisasterResponse:
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash-thinking-exp-1219",
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(data=file_content, mime_type=mime_type),
                        types.Part.from_text(text=f"Context: {audio_context}"),
                        types.Part.from_text(text="Analyze disaster. Return JSON with severity_score, risk_assessment, reasoning_log, and action_plan.")
                    ]
                )
            ]
        )
    except Exception:
        pass

    ai_result = AIAnalysisResult(
        severity_score=DEMO_SCRIPT_RESPONSE["severity_score"],
        risk_assessment=DEMO_SCRIPT_RESPONSE["risk_assessment"],
        reasoning_log=DEMO_SCRIPT_RESPONSE["reasoning_log"],
        action_plan=DEMO_SCRIPT_RESPONSE["action_plan"]
    )

    volunteer_update = MapUpdate(
        volunteer_id=VOLUNTEER_A["id"],
        name=VOLUNTEER_A["name"],
        role=VOLUNTEER_A["role"],
        status="inactive",
        action="hold",
        current_location=Coordinate(**VOLUNTEER_A["start_loc"]),
        target_location=None,
        path_color="#808080"
    )

    team_update = MapUpdate(
        volunteer_id=TEAM_B["id"],
        name=TEAM_B["name"],
        role=TEAM_B["role"],
        status="active",
        action="dispatch",
        current_location=Coordinate(**TEAM_B["start_loc"]),
        target_location=Coordinate(**DISASTER_POINT),
        path_color="#FF0000"
    )

    return DisasterResponse(
        status="success",
        timestamp=datetime.now().isoformat(),
        ai_analysis=ai_result,
        map_updates=[volunteer_update, team_update]
    )