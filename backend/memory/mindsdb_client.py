"""
MindsDB Integration for OrgMind Agent Memory
Stores every OrgMind analysis run with timestamp, enabling:
- History of past analyses for the dashboard
- Trend-over-time analysis (is org health improving?)
- Agent memory across sessions

MindsDB is a hackathon partner sponsor — using it makes OrgMind eligible
for the MindsDB prize track.

Falls back to local JSON file storage if MindsDB is not configured.
"""

import json
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

logger = logging.getLogger(__name__)

# Local fallback storage path
LOCAL_STORAGE_PATH = Path(__file__).parent.parent / "data" / "analysis_history.json"


class MindsDBClient:
    """
    Client for MindsDB Cloud — stores and retrieves OrgMind analysis history.
    Falls back to local JSON file if MindsDB credentials are not configured.
    """

    def __init__(self):
        self.host = os.getenv("MINDSDB_HOST", "")
        self.user = os.getenv("MINDSDB_USER", "")
        self.password = os.getenv("MINDSDB_PASSWORD", "")
        self.use_local = not all([self.host, self.user, self.password])

        if self.use_local:
            logger.info("MindsDB not configured — using local JSON storage")
            self._ensure_local_storage()
        else:
            logger.info(f"MindsDB configured: {self.host}")

    def _ensure_local_storage(self):
        """Create the local storage file if it doesn't exist."""
        if not LOCAL_STORAGE_PATH.exists():
            LOCAL_STORAGE_PATH.write_text("[]")

    async def store_analysis(self, analysis: dict[str, Any]) -> bool:
        """
        Store an analysis result with timestamp.
        Returns True if successful.
        """
        record = {
            "id": datetime.utcnow().strftime("%Y%m%d%H%M%S"),
            "timestamp": datetime.utcnow().isoformat(),
            "org_health_score": analysis.get("org_health_score", 0),
            "executive_summary": analysis.get("executive_summary", ""),
            "critical_action": analysis.get("critical_action", ""),
            "top_risks": analysis.get("top_risks", []),
            "blocker_count": analysis.get("blocker_data", {}).get("total_blockers", 0),
            "blocker_severity": analysis.get("blocker_data", {}).get("severity_score", 0),
            "overall_sentiment": analysis.get("sentiment_data", {}).get("overall_sentiment", 0),
            "sentiment_trend": analysis.get("sentiment_data", {}).get("trend", ""),
            "deadline_miss_prob": analysis.get("velocity_data", {}).get("deadline_miss_probability", 0),
            "demo_mode": analysis.get("demo_mode", True),
        }

        if self.use_local:
            return self._store_local(record)

        return await self._store_mindsdb(record)

    def _store_local(self, record: dict) -> bool:
        """Store analysis to local JSON file."""
        try:
            history = json.loads(LOCAL_STORAGE_PATH.read_text())
            history.append(record)
            # Keep only last 100 records
            history = history[-100:]
            LOCAL_STORAGE_PATH.write_text(json.dumps(history, indent=2))
            return True
        except Exception as e:
            logger.error(f"Failed to store locally: {e}")
            return False

    async def _store_mindsdb(self, record: dict) -> bool:
        """Store analysis in MindsDB Cloud."""
        try:
            import mindsdb_sdk
            server = mindsdb_sdk.connect(
                f"https://{self.host}",
                login=self.user,
                password=self.password,
            )
            db = server.get_database("orgmind_db")
            table = db.get_table("analysis_history")
            table.insert(record)
            return True
        except ImportError:
            logger.warning("mindsdb_sdk not installed, falling back to local storage")
            self.use_local = True
            return self._store_local(record)
        except Exception as e:
            logger.error(f"MindsDB store error: {e}. Falling back to local.")
            return self._store_local(record)

    async def get_history(self, limit: int = 10) -> list[dict]:
        """
        Retrieve the last N analysis runs.
        Used to show trends and history in the dashboard.
        """
        if self.use_local:
            return self._get_local_history(limit)
        return await self._get_mindsdb_history(limit)

    def _get_local_history(self, limit: int) -> list[dict]:
        """Get history from local JSON file."""
        try:
            history = json.loads(LOCAL_STORAGE_PATH.read_text())
            return history[-limit:]
        except Exception as e:
            logger.error(f"Failed to read local history: {e}")
            return []

    async def _get_mindsdb_history(self, limit: int) -> list[dict]:
        """Get history from MindsDB Cloud."""
        try:
            import mindsdb_sdk
            server = mindsdb_sdk.connect(
                f"https://{self.host}",
                login=self.user,
                password=self.password,
            )
            query = server.query(
                f"SELECT * FROM orgmind_db.analysis_history ORDER BY timestamp DESC LIMIT {limit}"
            )
            return query.fetch()
        except Exception as e:
            logger.error(f"MindsDB read error: {e}. Falling back to local.")
            return self._get_local_history(limit)


# Singleton instance
mindsdb_client = MindsDBClient()
