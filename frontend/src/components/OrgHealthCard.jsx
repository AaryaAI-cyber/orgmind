/**
 * Org Health Score Card
 * Displays a large score (0-100) with color coding:
 *   Green (>75), Amber (50-75), Red (<50)
 * Shows executive summary and critical action.
 */
export default function OrgHealthCard({ score, summary, criticalAction, sentimentHistory }) {
  const getScoreColor = (s) => {
    if (s > 75) return { text: 'text-green-400', bg: 'bg-green-400', ring: 'ring-green-400/30' }
    if (s > 50) return { text: 'text-amber-400', bg: 'bg-amber-400', ring: 'ring-amber-400/30' }
    return { text: 'text-red-400', bg: 'bg-red-400', ring: 'ring-red-400/30' }
  }

  const colors = getScoreColor(score)

  // Calculate trend from sentiment history
  const trend = sentimentHistory && sentimentHistory.length >= 2
    ? sentimentHistory[sentimentHistory.length - 1] - sentimentHistory[sentimentHistory.length - 2]
    : 0

  return (
    <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Organization Health Score
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Based on blockers, team sentiment, and delivery velocity
          </p>
        </div>
        {trend !== 0 && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            <span>{trend > 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(trend)} pts</span>
          </div>
        )}
      </div>

      {/* Big Score */}
      <div className="flex items-center gap-6 mb-6">
        <div className={`relative flex items-center justify-center w-28 h-28 rounded-full ring-4 ${colors.ring}`}>
          <span className={`text-5xl font-extrabold ${colors.text}`}>{score}</span>
          <span className="absolute bottom-2 text-xs text-gray-500">/100</span>
        </div>
        <div className="flex-1">
          <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
        </div>
      </div>

      {/* Critical Action */}
      {criticalAction && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-400 text-sm font-semibold">Critical Action Required</span>
          </div>
          <p className="text-gray-300 text-sm">{criticalAction}</p>
        </div>
      )}
    </div>
  )
}
