"""
Mock Data Generator for OrgMind
Generates realistic fake company data for "Acme Corp" working on "Project Phoenix."
This data simulates Jira tickets, Slack messages, and sprint data to demonstrate
OrgMind's multi-agent analysis capabilities.
"""

import json
import random
from datetime import datetime, timedelta
from pathlib import Path


def generate_jira_tickets():
    """
    Generate 20 realistic Jira-style tickets with a mix of statuses.
    Some tickets are intentionally 'stuck' (In Progress with no recent updates)
    to demonstrate Blocker Scout detection.
    """
    today = datetime(2026, 5, 4)

    tickets = [
        # ---- STUCK / SILENT BLOCKERS (In Progress, old last_updated) ----
        {
            "ticket_id": "PROJ-142",
            "title": "Auth service integration failing on staging",
            "assignee": "Priya Kumar",
            "team": "Backend",
            "status": "In Progress",
            "priority": "HIGH",
            "story_points": 8,
            "created_date": (today - timedelta(days=14)).isoformat(),
            "last_updated": (today - timedelta(days=9)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["auth", "integration", "blocking"],
            "description": "OAuth2 flow breaks when redirecting from staging environment. Tokens expire immediately."
        },
        {
            "ticket_id": "PROJ-156",
            "title": "Fix race condition in payment processing",
            "assignee": "Raj Mehta",
            "team": "Backend",
            "status": "In Progress",
            "priority": "HIGH",
            "story_points": 5,
            "created_date": (today - timedelta(days=11)).isoformat(),
            "last_updated": (today - timedelta(days=7)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["payments", "concurrency", "critical"],
            "description": "Duplicate charges occurring under high concurrency. Mutex not working as expected."
        },
        {
            "ticket_id": "PROJ-163",
            "title": "Database migration for user schema v3",
            "assignee": "Sarah Chen",
            "team": "Backend",
            "status": "In Progress",
            "priority": "MEDIUM",
            "story_points": 5,
            "created_date": (today - timedelta(days=8)).isoformat(),
            "last_updated": (today - timedelta(days=6)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["database", "migration"],
            "description": "Need to add new fields for user preferences and notification settings."
        },
        # ---- IN PROGRESS (recently updated, not stuck) ----
        {
            "ticket_id": "PROJ-171",
            "title": "Implement email notification templates",
            "assignee": "Alex Rivera",
            "team": "Backend",
            "status": "In Progress",
            "priority": "MEDIUM",
            "story_points": 3,
            "created_date": (today - timedelta(days=4)).isoformat(),
            "last_updated": (today - timedelta(days=1)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["email", "notifications"],
            "description": "Build HTML email templates for welcome, password reset, and weekly digest."
        },
        {
            "ticket_id": "PROJ-174",
            "title": "Dashboard loading performance optimization",
            "assignee": "Mike Johnson",
            "team": "Frontend",
            "status": "In Progress",
            "priority": "MEDIUM",
            "story_points": 5,
            "created_date": (today - timedelta(days=3)).isoformat(),
            "last_updated": (today - timedelta(days=0)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["performance", "frontend"],
            "description": "Dashboard takes 4+ seconds to load. Need to optimize API calls and add caching."
        },
        # ---- DONE ----
        {
            "ticket_id": "PROJ-138",
            "title": "Set up CI/CD pipeline for staging",
            "assignee": "David Park",
            "team": "DevOps",
            "status": "Done",
            "priority": "HIGH",
            "story_points": 5,
            "created_date": (today - timedelta(days=12)).isoformat(),
            "last_updated": (today - timedelta(days=2)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["devops", "ci-cd"],
            "description": "GitHub Actions pipeline for automated testing and staging deployment."
        },
        {
            "ticket_id": "PROJ-145",
            "title": "User profile page redesign",
            "assignee": "Emma Wilson",
            "team": "Frontend",
            "status": "Done",
            "priority": "MEDIUM",
            "story_points": 3,
            "created_date": (today - timedelta(days=9)).isoformat(),
            "last_updated": (today - timedelta(days=1)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["ui", "profile"],
            "description": "Redesign user profile with new avatar upload and bio section."
        },
        {
            "ticket_id": "PROJ-148",
            "title": "Add unit tests for payment module",
            "assignee": "Raj Mehta",
            "team": "Backend",
            "status": "Done",
            "priority": "HIGH",
            "story_points": 3,
            "created_date": (today - timedelta(days=10)).isoformat(),
            "last_updated": (today - timedelta(days=3)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["testing", "payments"],
            "description": "80% coverage target for payment processing module."
        },
        {
            "ticket_id": "PROJ-151",
            "title": "Implement search autocomplete",
            "assignee": "Emma Wilson",
            "team": "Frontend",
            "status": "Done",
            "priority": "LOW",
            "story_points": 2,
            "created_date": (today - timedelta(days=7)).isoformat(),
            "last_updated": (today - timedelta(days=2)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["search", "ux"],
            "description": "Add typeahead search suggestions to the main search bar."
        },
        {
            "ticket_id": "PROJ-153",
            "title": "Fix mobile responsive layout issues",
            "assignee": "Mike Johnson",
            "team": "Frontend",
            "status": "Done",
            "priority": "MEDIUM",
            "story_points": 2,
            "created_date": (today - timedelta(days=6)).isoformat(),
            "last_updated": (today - timedelta(days=1)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["mobile", "css"],
            "description": "Sidebar overlaps main content on screens < 768px."
        },
        {
            "ticket_id": "PROJ-159",
            "title": "API rate limiting middleware",
            "assignee": "David Park",
            "team": "Backend",
            "status": "Done",
            "priority": "HIGH",
            "story_points": 3,
            "created_date": (today - timedelta(days=8)).isoformat(),
            "last_updated": (today - timedelta(days=2)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["security", "api"],
            "description": "Implement rate limiting to prevent API abuse. 100 req/min per user."
        },
        {
            "ticket_id": "PROJ-160",
            "title": "Logging and monitoring setup",
            "assignee": "David Park",
            "team": "DevOps",
            "status": "Done",
            "priority": "MEDIUM",
            "story_points": 5,
            "created_date": (today - timedelta(days=9)).isoformat(),
            "last_updated": (today - timedelta(days=3)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["monitoring", "observability"],
            "description": "Set up structured logging with ELK stack and Grafana dashboards."
        },
        # ---- TODO (not started yet) ----
        {
            "ticket_id": "PROJ-175",
            "title": "Implement payment gateway webhook handler",
            "assignee": "Raj Mehta",
            "team": "Backend",
            "status": "Todo",
            "priority": "HIGH",
            "story_points": 8,
            "created_date": (today - timedelta(days=3)).isoformat(),
            "last_updated": (today - timedelta(days=3)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["payments", "webhooks"],
            "description": "Handle Stripe webhook events for payment confirmation, refunds, and disputes."
        },
        {
            "ticket_id": "PROJ-176",
            "title": "Email notification preferences UI",
            "assignee": "Emma Wilson",
            "team": "Frontend",
            "status": "Todo",
            "priority": "MEDIUM",
            "story_points": 3,
            "created_date": (today - timedelta(days=2)).isoformat(),
            "last_updated": (today - timedelta(days=2)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["email", "settings", "ui"],
            "description": "Settings page for users to configure which email notifications they receive."
        },
        {
            "ticket_id": "PROJ-177",
            "title": "Integrate third-party analytics SDK",
            "assignee": "Mike Johnson",
            "team": "Frontend",
            "status": "Todo",
            "priority": "LOW",
            "story_points": 2,
            "created_date": (today - timedelta(days=2)).isoformat(),
            "last_updated": (today - timedelta(days=2)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["analytics", "integration"],
            "description": "Add Mixpanel tracking for user engagement metrics."
        },
        {
            "ticket_id": "PROJ-178",
            "title": "Admin dashboard role-based access control",
            "assignee": "Sarah Chen",
            "team": "Backend",
            "status": "Todo",
            "priority": "HIGH",
            "story_points": 5,
            "created_date": (today - timedelta(days=1)).isoformat(),
            "last_updated": (today - timedelta(days=1)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["admin", "rbac", "security"],
            "description": "Implement role-based access for admin, manager, and viewer roles."
        },
        # ---- BLOCKED (explicitly marked) ----
        {
            "ticket_id": "PROJ-168",
            "title": "SSO integration with corporate IdP",
            "assignee": "Priya Kumar",
            "team": "Backend",
            "status": "Blocked",
            "priority": "HIGH",
            "story_points": 8,
            "created_date": (today - timedelta(days=7)).isoformat(),
            "last_updated": (today - timedelta(days=4)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["sso", "auth", "enterprise"],
            "description": "Need SAML metadata from customer IT team. Waiting on external dependency."
        },
        {
            "ticket_id": "PROJ-170",
            "title": "Load testing infrastructure setup",
            "assignee": "David Park",
            "team": "DevOps",
            "status": "Blocked",
            "priority": "MEDIUM",
            "story_points": 3,
            "created_date": (today - timedelta(days=5)).isoformat(),
            "last_updated": (today - timedelta(days=3)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["testing", "infrastructure"],
            "description": "Blocked on AWS account approval for load testing environment."
        },
        # ---- Additional In Progress (recently active) ----
        {
            "ticket_id": "PROJ-172",
            "title": "User onboarding flow redesign",
            "assignee": "Emma Wilson",
            "team": "Frontend",
            "status": "In Progress",
            "priority": "MEDIUM",
            "story_points": 5,
            "created_date": (today - timedelta(days=4)).isoformat(),
            "last_updated": (today - timedelta(days=0)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["onboarding", "ux"],
            "description": "New 3-step onboarding wizard with progress indicator."
        },
        {
            "ticket_id": "PROJ-173",
            "title": "API documentation with Swagger UI",
            "assignee": "Alex Rivera",
            "team": "Backend",
            "status": "In Progress",
            "priority": "LOW",
            "story_points": 2,
            "created_date": (today - timedelta(days=3)).isoformat(),
            "last_updated": (today - timedelta(days=1)).isoformat(),
            "sprint": "Sprint 23",
            "labels": ["documentation", "api"],
            "description": "Auto-generate API docs from FastAPI schemas. Add example requests."
        },
    ]
    return tickets


def generate_slack_messages():
    """
    Generate 50 realistic Slack messages across 3 team channels.
    Includes frustration signals, positive signals, and neutral messages
    to demonstrate Sentiment Pulse analysis.
    IMPORTANT: Sentiment is analyzed at TEAM level only, never individual.
    """
    today = datetime(2026, 5, 4)

    messages = [
        # ---- #backend-team (frustration-heavy, reflects blocked work) ----
        {"channel": "#backend-team", "author": "Priya Kumar", "timestamp": (today - timedelta(days=0, hours=2)).isoformat(),
         "text": "Still waiting on the auth service to be ready, been a week now. This is getting ridiculous."},
        {"channel": "#backend-team", "author": "Raj Mehta", "timestamp": (today - timedelta(days=0, hours=5)).isoformat(),
         "text": "Can someone from backend take a look at PROJ-142? We're blocked on this and it's holding up everything."},
        {"channel": "#backend-team", "author": "Sarah Chen", "timestamp": (today - timedelta(days=0, hours=8)).isoformat(),
         "text": "The migration script keeps failing. I've been debugging this for two days and still no update from the DBA team."},
        {"channel": "#backend-team", "author": "Priya Kumar", "timestamp": (today - timedelta(days=1, hours=3)).isoformat(),
         "text": "Nobody has responded to my auth service PR review request. It's been 4 days."},
        {"channel": "#backend-team", "author": "Raj Mehta", "timestamp": (today - timedelta(days=1, hours=6)).isoformat(),
         "text": "pushed another hotfix, third one this week. The payment race condition is really frustrating."},
        {"channel": "#backend-team", "author": "Alex Rivera", "timestamp": (today - timedelta(days=1, hours=9)).isoformat(),
         "text": "Email templates are done! Moving on to the notification service integration."},
        {"channel": "#backend-team", "author": "Sarah Chen", "timestamp": (today - timedelta(days=2, hours=4)).isoformat(),
         "text": "Why are we still on the old schema? This migration should have been done last sprint."},
        {"channel": "#backend-team", "author": "Priya Kumar", "timestamp": (today - timedelta(days=2, hours=7)).isoformat(),
         "text": "I'm blocked on PROJ-142 and PROJ-168. Can't make progress on either without external input."},
        {"channel": "#backend-team", "author": "Raj Mehta", "timestamp": (today - timedelta(days=3, hours=2)).isoformat(),
         "text": "Finally fixed the unit tests. At least something is working."},
        {"channel": "#backend-team", "author": "Alex Rivera", "timestamp": (today - timedelta(days=3, hours=5)).isoformat(),
         "text": "Rate limiting middleware is merged and deployed. Working great in staging."},
        {"channel": "#backend-team", "author": "Sarah Chen", "timestamp": (today - timedelta(days=3, hours=8)).isoformat(),
         "text": "Has anyone heard back from the DBA team? I sent two emails and got ignored."},
        {"channel": "#backend-team", "author": "Priya Kumar", "timestamp": (today - timedelta(days=4, hours=3)).isoformat(),
         "text": "Feeling stuck. Auth and SSO are both waiting on other teams. Nothing I can do."},
        {"channel": "#backend-team", "author": "Raj Mehta", "timestamp": (today - timedelta(days=4, hours=6)).isoformat(),
         "text": "The concurrency issue is worse than we thought. Need to rethink the locking strategy entirely."},
        {"channel": "#backend-team", "author": "Alex Rivera", "timestamp": (today - timedelta(days=5, hours=4)).isoformat(),
         "text": "Great standup today, feels like we have a clear plan for the notification system."},
        {"channel": "#backend-team", "author": "Sarah Chen", "timestamp": (today - timedelta(days=5, hours=7)).isoformat(),
         "text": "Started the migration work. Hopeful I can get it done by Wednesday."},
        {"channel": "#backend-team", "author": "Priya Kumar", "timestamp": (today - timedelta(days=6, hours=3)).isoformat(),
         "text": "Auth service initial setup is done. Now need to integrate with staging. Should be straightforward."},
        {"channel": "#backend-team", "author": "Raj Mehta", "timestamp": (today - timedelta(days=6, hours=8)).isoformat(),
         "text": "Payment tests all passing. Good progress this week."},

        # ---- #frontend-team (mostly positive, some concerns) ----
        {"channel": "#frontend-team", "author": "Emma Wilson", "timestamp": (today - timedelta(days=0, hours=3)).isoformat(),
         "text": "Profile page redesign is shipped! Really happy with how it turned out."},
        {"channel": "#frontend-team", "author": "Mike Johnson", "timestamp": (today - timedelta(days=0, hours=6)).isoformat(),
         "text": "Dashboard performance is improving. Down to 2.1s load time from 4.3s."},
        {"channel": "#frontend-team", "author": "Emma Wilson", "timestamp": (today - timedelta(days=0, hours=9)).isoformat(),
         "text": "Thanks @Mike for the responsive fixes, mobile looks great now!"},
        {"channel": "#frontend-team", "author": "Mike Johnson", "timestamp": (today - timedelta(days=1, hours=4)).isoformat(),
         "text": "Search autocomplete is working nicely. Users will love this feature."},
        {"channel": "#frontend-team", "author": "Emma Wilson", "timestamp": (today - timedelta(days=1, hours=7)).isoformat(),
         "text": "Starting the onboarding flow today. The wireframes look clean."},
        {"channel": "#frontend-team", "author": "Mike Johnson", "timestamp": (today - timedelta(days=2, hours=3)).isoformat(),
         "text": "Waiting on the backend API for the notification preferences. Can't build the UI without it."},
        {"channel": "#frontend-team", "author": "Emma Wilson", "timestamp": (today - timedelta(days=2, hours=6)).isoformat(),
         "text": "Onboarding wizard step 1 is done. Moving to step 2. This is going well."},
        {"channel": "#frontend-team", "author": "Mike Johnson", "timestamp": (today - timedelta(days=3, hours=4)).isoformat(),
         "text": "Fixed the sidebar overlap bug. CSS grid was the issue."},
        {"channel": "#frontend-team", "author": "Emma Wilson", "timestamp": (today - timedelta(days=3, hours=7)).isoformat(),
         "text": "Good sprint so far for frontend. We're ahead of schedule on most items."},
        {"channel": "#frontend-team", "author": "Mike Johnson", "timestamp": (today - timedelta(days=4, hours=5)).isoformat(),
         "text": "Analytics SDK integration is next week. Low priority but important for product."},
        {"channel": "#frontend-team", "author": "Emma Wilson", "timestamp": (today - timedelta(days=5, hours=3)).isoformat(),
         "text": "Started the profile redesign. Using the new component library — it's really nice to work with."},
        {"channel": "#frontend-team", "author": "Mike Johnson", "timestamp": (today - timedelta(days=5, hours=6)).isoformat(),
         "text": "Performance audit results are in. Main bottleneck is the dashboard API call — need backend to optimize."},
        {"channel": "#frontend-team", "author": "Emma Wilson", "timestamp": (today - timedelta(days=6, hours=4)).isoformat(),
         "text": "Sprint planning went well. Realistic goals this time. Feeling good about delivery."},

        # ---- #general (mixed, cross-team) ----
        {"channel": "#general", "author": "David Park", "timestamp": (today - timedelta(days=0, hours=4)).isoformat(),
         "text": "CI/CD pipeline is fully operational. All merges to main now auto-deploy to staging."},
        {"channel": "#general", "author": "Priya Kumar", "timestamp": (today - timedelta(days=0, hours=7)).isoformat(),
         "text": "Can someone from leadership prioritize PROJ-142? It's been stuck for over a week and blocks 4 other tickets."},
        {"channel": "#general", "author": "David Park", "timestamp": (today - timedelta(days=1, hours=5)).isoformat(),
         "text": "Monitoring dashboards are live. We can now see error rates and latency in real time."},
        {"channel": "#general", "author": "Raj Mehta", "timestamp": (today - timedelta(days=1, hours=8)).isoformat(),
         "text": "Payment processing had 3 incidents this week. We need to address the race condition before launch."},
        {"channel": "#general", "author": "Emma Wilson", "timestamp": (today - timedelta(days=2, hours=5)).isoformat(),
         "text": "Frontend sprint velocity is looking good. We should hit all our targets."},
        {"channel": "#general", "author": "Sarah Chen", "timestamp": (today - timedelta(days=2, hours=8)).isoformat(),
         "text": "Database migration is taking longer than expected. Schema changes are more complex than we scoped."},
        {"channel": "#general", "author": "David Park", "timestamp": (today - timedelta(days=3, hours=3)).isoformat(),
         "text": "Load testing is blocked on AWS account approval. Submitted the request 3 days ago."},
        {"channel": "#general", "author": "Priya Kumar", "timestamp": (today - timedelta(days=3, hours=6)).isoformat(),
         "text": "Sprint 23 midpoint check: backend is behind, frontend is on track. We need to discuss priorities."},
        {"channel": "#general", "author": "Alex Rivera", "timestamp": (today - timedelta(days=4, hours=4)).isoformat(),
         "text": "Notification service architecture is finalized. Starting implementation tomorrow."},
        {"channel": "#general", "author": "Mike Johnson", "timestamp": (today - timedelta(days=4, hours=7)).isoformat(),
         "text": "Great collaboration with backend team on the API contracts. Thanks for the quick turnaround."},
        {"channel": "#general", "author": "David Park", "timestamp": (today - timedelta(days=5, hours=5)).isoformat(),
         "text": "Grafana dashboards are set up. Logging is centralized. We're in good shape for observability."},
        {"channel": "#general", "author": "Sarah Chen", "timestamp": (today - timedelta(days=5, hours=8)).isoformat(),
         "text": "Migration work is starting. I have a plan but it's going to be tight."},
        {"channel": "#general", "author": "Raj Mehta", "timestamp": (today - timedelta(days=6, hours=4)).isoformat(),
         "text": "Payment module tests are all green. Confident in the core logic, just need to fix the concurrency edge case."},
        {"channel": "#general", "author": "Emma Wilson", "timestamp": (today - timedelta(days=6, hours=7)).isoformat(),
         "text": "UI component library is updated. All new components follow the design system now."},
        {"channel": "#general", "author": "David Park", "timestamp": (today - timedelta(days=6, hours=9)).isoformat(),
         "text": "Welcome to Sprint 23 everyone! Let's make it a great one."},
        {"channel": "#general", "author": "Priya Kumar", "timestamp": (today - timedelta(days=5, hours=2)).isoformat(),
         "text": "Quick reminder: PROJ-142 auth service is critical path. If this slips, payment integration can't start."},
        {"channel": "#general", "author": "Mike Johnson", "timestamp": (today - timedelta(days=3, hours=9)).isoformat(),
         "text": "Dashboard perf optimization PR is up for review. Would appreciate eyes on it."},
        {"channel": "#general", "author": "Alex Rivera", "timestamp": (today - timedelta(days=2, hours=2)).isoformat(),
         "text": "API docs are coming along nicely. Should have Swagger UI ready by end of week."},
        {"channel": "#general", "author": "Raj Mehta", "timestamp": (today - timedelta(days=1, hours=2)).isoformat(),
         "text": "Still working on the payment race condition. This is harder than expected."},
        {"channel": "#general", "author": "Sarah Chen", "timestamp": (today - timedelta(days=0, hours=10)).isoformat(),
         "text": "Migration script draft is ready but I need DBA review before running it. Still no response from them."},
    ]
    return messages


def generate_sprint_data():
    """
    Generate sprint data for Sprint 23.
    Shows a team that is behind pace — planned 84 points but only completed 31
    with 4 days remaining. This triggers Velocity Tracker deadline miss prediction.
    """
    return {
        "sprint_name": "Sprint 23",
        "sprint_goal": "Complete auth integration, payment processing, and user onboarding",
        "start_date": "2026-04-28",
        "end_date": "2026-05-08",
        "total_days": 10,
        "days_elapsed": 6,
        "days_remaining": 4,
        "planned_story_points": 84,
        "completed_story_points": 31,
        "in_progress_story_points": 33,
        "todo_story_points": 20,
        "team_members": [
            {"name": "Priya Kumar", "role": "Senior Backend Engineer", "team": "Backend"},
            {"name": "Raj Mehta", "role": "Backend Engineer", "team": "Backend"},
            {"name": "Sarah Chen", "role": "Database Engineer", "team": "Backend"},
            {"name": "Alex Rivera", "role": "Backend Engineer", "team": "Backend"},
            {"name": "Emma Wilson", "role": "Senior Frontend Engineer", "team": "Frontend"},
            {"name": "Mike Johnson", "role": "Frontend Engineer", "team": "Frontend"},
            {"name": "David Park", "role": "DevOps Engineer", "team": "DevOps"},
        ],
        "features": [
            {"name": "Authentication & SSO", "total_points": 16, "completed_points": 0, "status": "At Risk"},
            {"name": "Payment Processing", "total_points": 16, "completed_points": 6, "status": "At Risk"},
            {"name": "User Onboarding", "total_points": 10, "completed_points": 5, "status": "On Track"},
            {"name": "Email Notifications", "total_points": 8, "completed_points": 3, "status": "On Track"},
            {"name": "Dashboard Performance", "total_points": 7, "completed_points": 4, "status": "On Track"},
            {"name": "DevOps & Monitoring", "total_points": 16, "completed_points": 13, "status": "Complete"},
            {"name": "UI Components", "total_points": 11, "completed_points": 0, "status": "Not Started"},
        ],
        "velocity_history": [
            {"sprint": "Sprint 19", "planned": 70, "completed": 68},
            {"sprint": "Sprint 20", "planned": 75, "completed": 71},
            {"sprint": "Sprint 21", "planned": 78, "completed": 65},
            {"sprint": "Sprint 22", "planned": 80, "completed": 62},
            {"sprint": "Sprint 23", "planned": 84, "completed": 31},
        ],
    }


def generate_all_mock_data():
    """Generate all mock data and return as a single dictionary."""
    return {
        "company": "Acme Corp",
        "project": "Project Phoenix",
        "generated_at": datetime(2026, 5, 4).isoformat(),
        "jira_tickets": generate_jira_tickets(),
        "slack_messages": generate_slack_messages(),
        "sprint_data": generate_sprint_data(),
    }


if __name__ == "__main__":
    data = generate_all_mock_data()
    output_path = Path(__file__).parent / "mock_data.json"
    with open(output_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Mock data generated: {output_path}")
    print(f"  - {len(data['jira_tickets'])} Jira tickets")
    print(f"  - {len(data['slack_messages'])} Slack messages")
    print(f"  - Sprint: {data['sprint_data']['sprint_name']}")
