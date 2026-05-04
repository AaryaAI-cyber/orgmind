"""
Orchestrator Agent — The Master Brain
Receives output from all 3 specialized agents, combines them into a single
context, sends to Qwen on AMD cloud, and generates a human-readable
organizational health report.

This is the central intelligence that synthesizes blockers, sentiment, and
velocity into a unified insight that a CEO or Delivery Head can act on.
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Any, Optional

from backend.agents import blocker_scout, sentiment_pulse, velocity_tracker
from backend.amd.amd_client import amd_client

logger = logging.getLogger(__name__)


async def run_full_analysis(
    tickets: list[dict],
    slack_messages: list[dict],
    sprint_data: dict,
    user_question: Optional[str] = None,
) -> dict[str, Any]:
    """
    Run all 3 agents in parallel, combine their outputs, and generate
    a unified organizational health report via Qwen on AMD cloud.
    """
    # Run all 3 agents concurrently
    blocker_result, sentiment_result, velocity_result = await asyncio.gather(
        blocker_scout.analyze(tickets, slack_messages),
        sentiment_pulse.analyze(slack_messages),
        velocity_tracker.analyze(sprint_data),
    )

    # Calculate overall Org Health Score
    severity = blocker_result.get("severity_score", 0)
    sentiment = sentiment_result.get("overall_sentiment", 50)
    deadline_miss = velocity_result.get("deadline_miss_probability", 50)
    org_health_score = int(
        (100 - severity) * 0.4 + sentiment * 0.3 + (100 - deadline_miss) * 0.3
    )
    org_health_score = max(0, min(100, org_health_score))

    # Combine context for the LLM
    combined_context = {
        "blocker_analysis": {
            "total_blockers": blocker_result["total_blockers"],
            "severity_score": blocker_result["severity_score"],
            "critical_blockers": blocker_result["critical_blockers"][:5],
        },
        "sentiment_analysis": {
            "overall_sentiment": sentiment_result["overall_sentiment"],
            "trend": sentiment_result["trend"],
            "trend_change": sentiment_result["trend_change"],
            "teams": sentiment_result["teams"],
        },
        "velocity_analysis": {
            "sprint_name": velocity_result["sprint_name"],
            "completion_percentage": velocity_result["completion_percentage"],
            "deadline_miss_probability": velocity_result["deadline_miss_probability"],
            "predicted_delay_days": velocity_result["predicted_delay_days"],
            "at_risk_features": velocity_result["at_risk_features"],
            "actual_velocity": velocity_result["actual_velocity"],
            "required_velocity": velocity_result["required_velocity"],
        },
    }

    # Send combined context to Qwen for executive summary
    orchestrator_response = await _get_executive_briefing(combined_context, user_question)

    # Build the final report
    report = {
        "timestamp": datetime.utcnow().isoformat(),
        "org_health_score": org_health_score,
        "demo_mode": amd_client.is_demo_mode,
        "executive_summary": orchestrator_response.get("executive_summary", ""),
        "critical_action": orchestrator_response.get("critical_action", ""),
        "top_risks": orchestrator_response.get("top_risks", []),
        "answer_to_question": orchestrator_response.get("answer_to_question", ""),
        "blocker_data": blocker_result,
        "sentiment_data": sentiment_result,
        "velocity_data": velocity_result,
        "user_question": user_question,
    }

    return report


async def _get_executive_briefing(
    context: dict, user_question: Optional[str] = None
) -> dict:
    """
    Send the combined agent outputs to Qwen for synthesis into
    an executive-level briefing.
    """
    question_text = user_question or "Give a general organizational health overview"

    prompt = f"""You are OrgMind, an AI organizational intelligence system. You have received analysis from 3 specialized agents monitoring a software delivery team. Your job is to synthesize these findings into a clear, actionable executive briefing.

BLOCKER ANALYSIS:
{json.dumps(context['blocker_analysis'], indent=2)}

TEAM SENTIMENT ANALYSIS:
{json.dumps(context['sentiment_analysis'], indent=2)}

SPRINT VELOCITY ANALYSIS:
{json.dumps(context['velocity_analysis'], indent=2)}

Generate a response with:
1. An executive summary (2-3 sentences, plain English, brutally honest)
2. The #1 most critical action to take TODAY
3. The top 3 risks in priority order
4. A natural language answer to the user's question: {question_text}

Format as JSON with keys: executive_summary, critical_action, top_risks, answer_to_question"""

    system_prompt = (
        "You are OrgMind, an AI organizational intelligence system. "
        "Be brutally honest, data-driven, and actionable. "
        "Never sugarcoat problems. Respond only in valid JSON."
    )

    response = await amd_client.generate(
        prompt=prompt,
        system_prompt=system_prompt,
        max_tokens=1500,
        response_key="orchestrator",
    )

    try:
        # Try to extract JSON from markdown code blocks
        cleaned = response.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("```", 2)[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
            cleaned = cleaned.strip()
        return json.loads(cleaned)
    except (json.JSONDecodeError, IndexError):
        return {
            "executive_summary": response[:500] if response else "Analysis complete.",
            "critical_action": "Review the detailed agent reports below.",
            "top_risks": ["See blocker, sentiment, and velocity data for details."],
            "answer_to_question": response[:300] if response else "",
        }
