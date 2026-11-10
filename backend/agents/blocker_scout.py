"""
Agent 1 — Blocker Scout
Finds tickets that are "In Progress" but have had no status update or comment
for 5+ days. These are "silent blockers" — problems that exist but haven't
been escalated to leadership.

Input: List of Jira-style ticket objects + Slack messages (from mock data)
Output: Structured JSON with blocker details, severity score, and recommendations
"""

import json
import logging
from datetime import datetime
from typing import Any

from backend.amd.amd_client import amd_client

logger = logging.getLogger(__name__)

# Impact weight multipliers by priority
IMPACT_WEIGHTS = {"HIGH": 3, "MEDIUM": 2, "LOW": 1}


async def analyze(tickets: list[dict[str, Any]], slack_messages: list[dict[str, Any]]) -> dict[str, Any]:
    """
    Scan all tickets for silent blockers — tickets stuck In Progress 5+ days
    with no updates. Cross-references Slack messages to find issues that were
    discussed by engineers but never escalated to PMs.
    """
    today = datetime.now()
    silent_blockers = []

    # Collect all ticket IDs mentioned in Slack for cross-reference
    slack_mentioned_tickets: set[str] = set()
    for msg in slack_messages:
        for ticket in tickets:
            if ticket["ticket_id"] in msg["text"]:
                slack_mentioned_tickets.add(ticket["ticket_id"])

    # Filter for In Progress tickets stuck 5+ days
    for ticket in tickets:
        if ticket["status"] != "In Progress":
            continue

        last_updated = datetime.fromisoformat(ticket["last_updated"])
        days_stuck = (today - last_updated).days

        if days_stuck < 5:
            continue

        impact_weight = IMPACT_WEIGHTS.get(ticket["priority"], 1)
        risk_score = days_stuck * impact_weight
        mentioned_in_slack = ticket["ticket_id"] in slack_mentioned_tickets

        silent_blockers.append({
            "ticket_id": ticket["ticket_id"],
            "title": ticket["title"],
            "assignee": ticket["assignee"],
            "team": ticket["team"],
            "days_stuck": days_stuck,
            "priority": ticket["priority"],
            "mentioned_in_slack": mentioned_in_slack,
            "escalated_to_pm": False,
            "impact": ticket["priority"],
            "risk_score": risk_score,
            "labels": ticket.get("labels", []),
            "recommended_action": _generate_recommendation(ticket, days_stuck, mentioned_in_slack),
        })

    # Sort by risk score descending (most critical first)
    silent_blockers.sort(key=lambda b: b["risk_score"], reverse=True)

    # Calculate overall severity score (0-100)
    if silent_blockers:
        max_possible = max(b["risk_score"] for b in silent_blockers) * 1.5
        severity_score = min(100, int(sum(b["risk_score"] for b in silent_blockers) / max_possible * 100))
    else:
        severity_score = 0

    result = {
        "total_blockers": len(silent_blockers),
        "critical_blockers": silent_blockers,
        "severity_score": severity_score,
    }

    # Send to Qwen for deeper analysis
    llm_analysis = await _get_llm_analysis(result)
    result["llm_analysis"] = llm_analysis

    return result


def _generate_recommendation(ticket: dict, days_stuck: int, mentioned_in_slack: bool) -> str:
    """Generate a human-readable recommendation for each blocker."""
    rec = f"Ticket stuck for {days_stuck} days"
    if mentioned_in_slack:
        rec += " — flagged by engineers in Slack but never escalated to PM"
    if ticket["priority"] == "HIGH":
        rec += ". Escalate to PM immediately"
    if any(label in ticket.get("labels", []) for label in ["blocking", "critical"]):
        rec += " — blocks downstream tasks"
    return rec


async def _get_llm_analysis(blocker_data: dict) -> dict:
    """
    Send blocker data to Qwen via AMD cloud for deeper analysis.
    Returns severity score, critical action, and delivery risk assessment.
    """
    prompt = f"""You are an expert project delivery analyst. You have identified the following silent blockers in a software project. Analyze them and provide:
1. A severity score from 0-100
2. The single most critical action to take today
3. Estimated delivery risk

Blockers data: {json.dumps(blocker_data, indent=2)}

Respond in JSON format only with keys: severity_score, critical_action, delivery_risk, analysis"""

    response = await amd_client.generate(
        prompt=prompt,
        system_prompt="You are a project delivery risk analyst. Respond only in valid JSON.",
        response_key="blocker_analysis",
    )

    try:
        cleaned = response.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("```", 2)[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
            cleaned = cleaned.strip()
        return json.loads(cleaned)
    except (json.JSONDecodeError, IndexError):
        return {"raw_analysis": response}
