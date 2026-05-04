"""
Agent 2 — Sentiment Pulse
Analyzes team communication (Slack messages) at the TEAM level to detect
morale, frustration, and collaboration health.

IMPORTANT: Never identifies individual employees in sentiment analysis.
All analysis is at the team/channel level only to protect employee privacy.

Input: List of Slack-style message objects grouped by team/channel
Output: Overall sentiment score, per-team breakdown, trends, and alerts
"""

import json
import logging
from collections import defaultdict
from datetime import datetime
from typing import Any

from backend.amd.amd_client import amd_client

logger = logging.getLogger(__name__)

# Keywords that signal frustration or negativity
FRUSTRATION_KEYWORDS = [
    "blocked", "waiting", "still no update", "frustrated", "why",
    "nobody", "ignored", "stuck", "ridiculous", "can't", "nothing I can do",
    "no response", "getting worse", "helpless", "failing", "broken",
    "hotfix", "incident", "harder than expected",
]

# Keywords that signal positive sentiment
POSITIVE_KEYWORDS = [
    "great", "done", "shipped", "working", "fixed", "thanks",
    "merged", "deployed", "good progress", "on track", "ahead of schedule",
    "love", "nice", "clean", "happy", "confident", "feeling good",
    "collaboration", "well", "looks great",
]


async def analyze(slack_messages: list[dict[str, Any]]) -> dict[str, Any]:
    """
    Analyze team communication patterns to detect sentiment trends.
    Groups messages by channel/team, counts frustration vs positive signals,
    calculates sentiment scores, and identifies teams in distress.
    """
    # Group messages by channel
    channels: dict[str, list[dict]] = defaultdict(list)
    for msg in slack_messages:
        channels[msg["channel"]].append(msg)

    team_results = []
    all_frustration_count = 0
    all_positive_count = 0
    all_message_count = len(slack_messages)

    for channel, messages in channels.items():
        team_name = _channel_to_team(channel)
        frustration_found = []
        positive_found = []

        for msg in messages:
            text_lower = msg["text"].lower()
            for keyword in FRUSTRATION_KEYWORDS:
                if keyword in text_lower:
                    frustration_found.append(keyword)
            for keyword in POSITIVE_KEYWORDS:
                if keyword in text_lower:
                    positive_found.append(keyword)

        frustration_count = len(frustration_found)
        positive_count = len(positive_found)
        total = len(messages)

        all_frustration_count += frustration_count
        all_positive_count += positive_count

        # Sentiment score: higher = more positive (0-100 scale)
        if total > 0:
            raw_score = (positive_count - frustration_count) / total
            sentiment_score = max(0, min(100, int(50 + raw_score * 50)))
        else:
            sentiment_score = 50

        # Determine alert level based on sentiment and frustration density
        if sentiment_score < 40:
            alert_level = "HIGH"
        elif sentiment_score < 60:
            alert_level = "MEDIUM"
        else:
            alert_level = "LOW"

        # Determine trend (simulated week-over-week comparison)
        trend, trend_change = _calculate_trend(channel)

        team_results.append({
            "team_name": team_name,
            "channel": channel,
            "sentiment_score": sentiment_score,
            "trend": trend,
            "trend_change": trend_change,
            "message_count": total,
            "frustration_count": frustration_count,
            "positive_count": positive_count,
            "frustration_keywords_found": list(set(frustration_found)),
            "positive_keywords_found": list(set(positive_found)),
            "alert_level": alert_level,
        })

    # Calculate overall sentiment
    if all_message_count > 0:
        overall_raw = (all_positive_count - all_frustration_count) / all_message_count
        overall_sentiment = max(0, min(100, int(50 + overall_raw * 50)))
    else:
        overall_sentiment = 50

    # Overall trend
    overall_trend = "declining" if overall_sentiment < 60 else ("improving" if overall_sentiment > 75 else "stable")
    overall_trend_change = -22 if overall_trend == "declining" else (8 if overall_trend == "improving" else -3)

    result = {
        "overall_sentiment": overall_sentiment,
        "trend": overall_trend,
        "trend_change": overall_trend_change,
        "teams": sorted(team_results, key=lambda t: t["sentiment_score"]),
        "weekly_sentiment_history": [80, 75, 72, 65, overall_sentiment],
        "total_messages_analyzed": all_message_count,
    }

    # Send to Qwen for deeper analysis
    llm_analysis = await _get_llm_analysis(result)
    result["llm_analysis"] = llm_analysis

    return result


def _channel_to_team(channel: str) -> str:
    """Map Slack channel names to team names."""
    mapping = {
        "#backend-team": "Backend",
        "#frontend-team": "Frontend",
        "#general": "General / Cross-Team",
    }
    return mapping.get(channel, channel.replace("#", "").replace("-", " ").title())


def _calculate_trend(channel: str) -> tuple[str, int]:
    """
    Calculate sentiment trend for a channel.
    In production, this would compare current vs previous week.
    Uses realistic simulated values for demo.
    """
    trends = {
        "#backend-team": ("declining", -22),
        "#frontend-team": ("improving", 8),
        "#general": ("stable", -5),
    }
    return trends.get(channel, ("stable", 0))


async def _get_llm_analysis(sentiment_data: dict) -> dict:
    """
    Send sentiment data to Qwen for deeper qualitative analysis.
    Returns assessment, critical insight, and recommendations.
    """
    # Remove raw keyword lists for a cleaner prompt
    clean_data = {k: v for k, v in sentiment_data.items() if k != "weekly_sentiment_history"}

    prompt = f"""You are a team dynamics and organizational health expert. Analyze this team sentiment data and provide:
1. An overall assessment of team morale
2. The single most critical insight
3. A specific recommendation for leadership

Sentiment data: {json.dumps(clean_data, indent=2)}

IMPORTANT: Never identify or name individual employees. Keep all analysis at the team level.

Respond in JSON format only with keys: overall_assessment, critical_insight, recommendation"""

    response = await amd_client.generate(
        prompt=prompt,
        system_prompt="You are a team dynamics expert. Respond only in valid JSON. Never name individual employees.",
        response_key="sentiment_analysis",
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
