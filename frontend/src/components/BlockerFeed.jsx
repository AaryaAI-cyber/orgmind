// BlockerFeed.jsx
// ============================================================
// ITIL-standard silent blocker list.
// Shows each blocker with: priority badges (P1-P4),
// ITIL type badges (Incident/Problem/Change/SR/Event),
// SLA breach indicators, Slack mention status,
// recommended fix assignee, and "Mark Resolved" button.
// ============================================================

import Tooltip from './Tooltip'

// ITIL priority badge colors
const PRIORITY_STYLES = {
  P1: { bg: 'bg-red-900/50', text: 'text-red-300', label: 'P1 CRITICAL' },
  P2: { bg: 'bg-orange-900/50', text: 'text-orange-300', label: 'P2 HIGH' },
  P3: { bg: 'bg-amber-900/50', text: 'text-amber-300', label: 'P3 MEDIUM' },
  P4: { bg: 'bg-green-900/50', text: 'text-green-300', label: 'P4 LOW' },
  HIGH: { bg: 'bg-red-900/50', text: 'text-red-300', label: 'HIGH' },
  MEDIUM: { bg: 'bg-amber-900/50', text: 'text-amber-300', label: 'MEDIUM' },
  LOW: { bg: 'bg-green-900/50', text: 'text-green-300', label: 'LOW' },
}

// ITIL type badge colors
const TYPE_STYLES = {
  Incident: 'bg-red-900/30 text-red-400 border-red-700/50',
  'Service Request': 'bg-blue-900/30 text-blue-400 border-blue-700/50',
  Problem: 'bg-orange-900/30 text-orange-400 border-orange-700/50',
  'Change Request': 'bg-purple-900/30 text-purple-400 border-purple-700/50',
  Event: 'bg-gray-800/50 text-gray-400 border-gray-700/50',
}

export default function BlockerFeed({ blockerData, onResolve, onAddTicket }) {
  if (!blockerData) return null

  const blockers = blockerData.critical_blockers || []

  return (
    <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Silent Blockers
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            ITIL tickets stuck 5+ days with no escalation
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onAddTicket && (
            <Tooltip text="Create a new ITIL-standard ticket using industry priority levels (P1-P4) and standard ticket types." position="bottom">
              <button onClick={onAddTicket}
                className="px-2 py-1 rounded text-xs text-amd-purple-light border border-amd-purple/30 hover:bg-amd-purple/10 transition-colors">
                + Add Ticket
              </button>
            </Tooltip>
          )}
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            blockers.length === 0 ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
          }`}>
            {blockers.length === 0 ? 'All Clear' : `${blockers.length} Found`}
          </div>
        </div>
      </div>

      {blockers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No silent blockers detected
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {blockers.map((blocker) => {
            const prioStyle = PRIORITY_STYLES[blocker.priority] || PRIORITY_STYLES.MEDIUM
            const typeStyle = TYPE_STYLES[blocker.itil_type] || ''

            return (
              <div
                key={blocker.ticket_id}
                className="bg-navy-900/60 rounded-lg p-4 border border-navy-700 hover:border-navy-600 transition-all"
              >
                {/* Top row: priority + type + ticket ID + days stuck */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* ITIL Priority badge */}
                    <Tooltip text={`ITIL priority level. ${blocker.priority === 'P1' ? 'P1 = business critical, immediate action required. SLA: respond in 15 minutes.' : blocker.priority === 'P2' ? 'P2 = high priority, fix within 1 hour.' : blocker.priority === 'P3' ? 'P3 = medium, workaround available. SLA: 4 hours.' : 'P4 = low, standard request. SLA: 1 business day.'}`} position="bottom">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${prioStyle.bg} ${prioStyle.text}`}>
                        {prioStyle.label}
                      </span>
                    </Tooltip>

                    {/* ITIL type badge */}
                    {blocker.itil_type && (
                      <span className={`px-2 py-0.5 rounded text-xs border ${typeStyle}`}>
                        {blocker.itil_type}
                      </span>
                    )}

                    {/* Ticket ID */}
                    <span className="text-amd-purple font-mono text-sm font-bold">
                      {blocker.ticket_id}
                    </span>
                  </div>

                  {/* Days stuck badge */}
                  <span className="bg-red-900/40 text-red-400 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">
                    {blocker.days_stuck}d stuck
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm text-gray-200 font-medium mb-2">
                  {blocker.title}
                </h3>

                {/* Assignee + team */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span>👤 {blocker.assignee}</span>
                  <span>· {blocker.team}</span>
                </div>

                {/* Status badges: Slack mention, PM awareness, SLA breach */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {blocker.mentioned_in_slack && (
                    <span className="px-2 py-0.5 rounded bg-amber-900/30 text-amber-400 text-xs border border-amber-700/50">
                      ⚠️ Mentioned in Slack — never escalated
                    </span>
                  )}
                  {!blocker.escalated_to_pm && !blocker.escalated && (
                    <span className="px-2 py-0.5 rounded bg-red-900/30 text-red-400 text-xs border border-red-700/50">
                      PM unaware
                    </span>
                  )}
                  {blocker.sla_breached && (
                    <Tooltip text={`Service Level Agreement breached. This ticket needed response in ${blocker.priority === 'P1' ? '15 minutes' : blocker.priority === 'P2' ? '1 hour' : '4 hours'} — it has been ${blocker.days_stuck} days.`} position="bottom">
                      <span className="px-2 py-0.5 rounded bg-red-900/50 text-red-300 text-xs border border-red-600/50 font-medium">
                        🚨 SLA Breached
                      </span>
                    </Tooltip>
                  )}
                </div>

                {/* Recommended fix assignee */}
                {blocker.recommended_fix_assignee && (
                  <p className="text-xs text-amd-purple-light mb-2">
                    💡 Recommended fix: Assign to {blocker.recommended_fix_assignee}
                  </p>
                )}

                {/* Bottom: recommended action + Mark Resolved */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400 italic flex-1">
                    {blocker.recommended_action}
                  </p>
                  {onResolve && (
                    <Tooltip text="Removes blocker from feed and recalculates Org Health Score. The score increases by 5 points." position="left">
                      <button onClick={() => onResolve(blocker.ticket_id)}
                        className="ml-3 px-3 py-1 rounded text-xs text-green-400 border border-green-700/50 hover:bg-green-900/30 transition-colors whitespace-nowrap">
                        Mark Resolved ✓
                      </button>
                    </Tooltip>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Severity score bar */}
      <div className="mt-4 pt-4 border-t border-navy-700">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Blocker Severity</span>
          <span className="font-mono">{blockerData.severity_score}/100</span>
        </div>
        <div className="w-full bg-navy-900 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              blockerData.severity_score > 70 ? 'bg-red-500' :
              blockerData.severity_score > 40 ? 'bg-amber-500' : 'bg-green-500'
            }`}
            style={{ width: `${blockerData.severity_score}%` }}
          />
        </div>
      </div>
    </div>
  )
}
