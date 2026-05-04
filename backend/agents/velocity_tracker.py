"""
Agent 3 — Velocity Tracker
Compares planned sprint velocity vs actual completion rate, then predicts
whether the current deadline will be met using mathematical projection.

Input: Sprint data object (from mock data)
Output: Velocity metrics, deadline miss probability, at-risk features, predictions
"""

import json
import logging
from datetime import datetime, timedelta
from typing import Any

from backend.amd.amd_client import amd_client

logger = logging.getLogger(__name__)


async def analyze(sprint_data: dict[str, Any]) -> dict[str, Any]:
    """
    Analyze sprint velocity and predict deadline outcomes.
    Compares planned vs actual velocity, identifies at-risk features,
    and calculates the probability of missing the deadline.
    """
    planned_points = sprint_data["planned_story_points"]
    completed_points = sprint_data["completed_story_points"]
    days_elapsed = sprint_data["days_elapsed"]
    days_remaining = sprint_data["days_remaining"]
    total_days = sprint_data["total_days"]

    # Calculate velocities
    actual_velocity = completed_points / max(days_elapsed, 1)
    planned_velocity = planned_points / max(total_days, 1)
    remaining_points = planned_points - completed_points
    required_velocity = remaining_points / max(days_remaining, 1)

    # Project completion date
    if actual_velocity > 0:
        days_needed = remaining_points / actual_velocity
        predicted_delay_days = max(0, int(days_needed - days_remaining))
    else:
        days_needed = float("inf")
        predicted_delay_days = 30

    # Calculate deadline miss probability
    velocity_ratio = actual_velocity / max(required_velocity, 0.1)
    if velocity_ratio >= 1.0:
        deadline_miss_probability = max(0, int(20 - (velocity_ratio - 1) * 40))
    else:
        miss_gap = 1.0 - velocity_ratio
        deadline_miss_probability = min(95, int(50 + miss_gap * 100))

    # Determine at-risk features
    at_risk_features = []
    for feature in sprint_data.get("features", []):
        if feature["status"] in ("At Risk", "Not Started"):
            remaining = feature["total_points"] - feature["completed_points"]
            if remaining > 0:
                at_risk_features.append(feature["name"])

    # Calculate predicted completion date
    end_date = datetime.fromisoformat(sprint_data["end_date"])
    predicted_completion = end_date + timedelta(days=predicted_delay_days)

    # Extract velocity history for trend analysis
    velocity_history = []
    for sprint in sprint_data.get("velocity_history", []):
        if sprint["planned"] > 0:
            velocity_history.append(
                round(sprint["completed"] / (total_days if sprint["sprint"] != "Sprint 23" else days_elapsed), 1)
            )

    # Determine velocity trend
    if len(velocity_history) >= 3:
        recent = velocity_history[-3:]
        if recent[-1] < recent[0] * 0.8:
            velocity_trend = "declining"
        elif recent[-1] > recent[0] * 1.1:
            velocity_trend = "improving"
        else:
            velocity_trend = "stable"
    else:
        velocity_trend = "insufficient_data"

    result = {
        "sprint_name": sprint_data["sprint_name"],
        "planned_points": planned_points,
        "completed_points": completed_points,
        "in_progress_points": sprint_data.get("in_progress_story_points", 0),
        "days_elapsed": days_elapsed,
        "days_remaining": days_remaining,
        "actual_velocity": round(actual_velocity, 1),
        "planned_velocity": round(planned_velocity, 1),
        "required_velocity": round(required_velocity, 1),
        "deadline_miss_probability": deadline_miss_probability,
        "predicted_completion_date": predicted_completion.strftime("%Y-%m-%d"),
        "original_deadline": sprint_data["end_date"],
        "predicted_delay_days": predicted_delay_days,
        "at_risk_features": at_risk_features,
        "velocity_trend": velocity_trend,
        "velocity_history": velocity_history,
        "completion_percentage": round(completed_points / max(planned_points, 1) * 100, 1),
    }

    # Send to Qwen for deeper analysis
    llm_analysis = await _get_llm_analysis(result)
    result["llm_analysis"] = llm_analysis

    return result


async def _get_llm_analysis(velocity_data: dict) -> dict:
    """
    Send velocity data to Qwen for risk assessment and prediction.
    Returns risk assessment, prediction narrative, and at-risk item details.
    """
    prompt = f"""You are a sprint delivery analyst. Analyze this sprint velocity data and provide:
1. A risk assessment narrative
2. Your prediction for whether the deadline will be met
3. Which specific items are most at risk and why

Sprint velocity data: {json.dumps(velocity_data, indent=2)}

Respond in JSON format only with keys: risk_assessment, prediction, at_risk_items"""

    response = await amd_client.generate(
        prompt=prompt,
        system_prompt="You are a sprint delivery analyst. Respond only in valid JSON.",
        response_key="velocity_analysis",
    )

    try:
        return json.loads(response)
    except json.JSONDecodeError:
        return {"raw_analysis": response}
