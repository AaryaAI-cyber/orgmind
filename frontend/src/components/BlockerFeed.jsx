/**
 * Blocker Feed Component
 * Lists silent blockers detected by Agent 1 (Blocker Scout).
 * Shows ticket ID, title, days stuck, assignee, Slack mention status,
 * and recommended action for each blocker.
 */
export default function BlockerFeed({ blockerData }) {
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
            Tickets stuck 5+ days with no escalation
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          blockers.length === 0 ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
        }`}>
          {blockers.length === 0 ? 'All Clear' : `${blockers.length} Found`}
        </div>
      </div>

      {blockers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No silent blockers detected
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {blockers.map((blocker) => (
            <div
              key={blocker.ticket_id}
              className="bg-navy-900/60 rounded-lg p-4 border border-navy-700 hover:border-navy-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-amd-purple font-mono text-sm font-bold">
                    {blocker.ticket_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    blocker.priority === 'HIGH'
                      ? 'bg-red-900/50 text-red-300'
                      : 'bg-amber-900/50 text-amber-300'
                  }`}>
                    {blocker.priority}
                  </span>
                </div>
                <span className="bg-red-900/40 text-red-400 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">
                  {blocker.days_stuck}d stuck
                </span>
              </div>

              <h3 className="text-sm text-gray-200 font-medium mb-2">
                {blocker.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                <span>Assignee: {blocker.assignee}</span>
                <span>Team: {blocker.team}</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-2">
                {blocker.mentioned_in_slack && (
                  <span className="px-2 py-0.5 rounded bg-amber-900/30 text-amber-400 text-xs border border-amber-700/50">
                    Mentioned in Slack — not escalated
                  </span>
                )}
                {!blocker.escalated_to_pm && (
                  <span className="px-2 py-0.5 rounded bg-red-900/30 text-red-400 text-xs border border-red-700/50">
                    PM unaware
                  </span>
                )}
              </div>

              {/* Recommendation */}
              <p className="text-xs text-gray-400 italic">
                {blocker.recommended_action}
              </p>
            </div>
          ))}
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
