"""
OrgMind — FastAPI Backend
Real-Time AI Organizational Intelligence System

Endpoints:
  POST /analyze  — Run all 3 agents and return unified analysis
  POST /chat     — "Ask OrgMind" conversational endpoint
  GET  /history  — Past analysis runs from MindsDB/local storage
  GET  /health   — System status check

All LLM inference goes through AMD Developer Cloud (Qwen2.5-72B on MI300X GPU).
Falls back to Demo Mode when AMD credentials are not configured.
"""

import json
import logging
import sys
from pathlib import Path
from typing import Optional

# Ensure the project root is in sys.path for imports to work in all environments
_project_root = str(Path(__file__).resolve().parent.parent)
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

load_dotenv()

from backend.agents.orchestrator import run_full_analysis
from backend.amd.amd_client import amd_client
from backend.memory.mindsdb_client import mindsdb_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="OrgMind API",
    description="Real-Time AI Organizational Intelligence System — powered by AMD MI300X + ROCm",
    version="1.0.0",
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load mock data at startup
MOCK_DATA_PATH = Path(__file__).parent / "data" / "mock_data.json"


def load_mock_data() -> dict:
    """Load the pre-generated mock company data."""
    with open(MOCK_DATA_PATH) as f:
        return json.load(f)


class ChatRequest(BaseModel):
    question: str


class AnalyzeRequest(BaseModel):
    question: Optional[str] = None


@app.get("/health")
async def health_check():
    """System status check — shows whether AMD cloud is connected or in demo mode."""
    return {
        "status": "healthy",
        "service": "OrgMind API",
        "demo_mode": amd_client.is_demo_mode,
        "amd_connected": not amd_client.is_demo_mode,
        "inference_engine": "AMD Instinct MI300X + ROCm" if not amd_client.is_demo_mode else "Demo Mode",
        "model": amd_client.model,
    }


@app.post("/analyze")
async def analyze(request: AnalyzeRequest = AnalyzeRequest()):
    """
    Run all 3 OrgMind agents (Blocker Scout, Sentiment Pulse, Velocity Tracker)
    in parallel, then synthesize results via the Orchestrator.
    Returns a unified organizational health report.
    """
    try:
        data = load_mock_data()
        report = await run_full_analysis(
            tickets=data["jira_tickets"],
            slack_messages=data["slack_messages"],
            sprint_data=data["sprint_data"],
            user_question=request.question,
        )

        # Store the analysis in MindsDB/local storage
        await mindsdb_client.store_analysis(report)

        return report
    except Exception as e:
        logger.error(f"Analysis error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat")
async def chat(request: ChatRequest):
    """
    'Ask OrgMind' conversational endpoint.
    Answers natural language questions about organizational health
    using the latest analysis data as context.
    """
    try:
        data = load_mock_data()

        # Build context from mock data directly for fast chat responses
        context = json.dumps({
            "company": data["company"],
            "project": data["project"],
            "total_tickets": len(data["jira_tickets"]),
            "stuck_tickets": [t for t in data["jira_tickets"] if t["status"] == "In Progress"],
            "sprint": data["sprint_data"]["sprint_name"],
            "planned_points": data["sprint_data"]["planned_story_points"],
            "completed_points": data["sprint_data"]["completed_story_points"],
            "days_remaining": data["sprint_data"]["days_remaining"],
            "recent_slack": [m["text"] for m in data["slack_messages"][:10]],
        }, indent=2)

        answer = await amd_client.chat(request.question, context)

        return {
            "question": request.question,
            "answer": answer,
            "demo_mode": amd_client.is_demo_mode,
        }
    except Exception as e:
        logger.error(f"Chat error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history")
async def get_history():
    """Retrieve past analysis runs for trend visualization."""
    try:
        history = await mindsdb_client.get_history(limit=10)
        return {"history": history, "count": len(history)}
    except Exception as e:
        logger.error(f"History error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


# Serve frontend static files if the dist directory exists
_frontend_dist = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if _frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=str(_frontend_dist / "assets")), name="static")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve the React SPA for any non-API route."""
        file_path = _frontend_dist / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(_frontend_dist / "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
