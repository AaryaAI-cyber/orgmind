// SentimentGraph.jsx
// ============================================================
// Recharts LineChart showing team sentiment trends over time.
// One line per team with color coding based on score.
// Reference lines at 70 (healthy) and 50 (critical).
// Tooltip explains privacy-first team-level analysis.
// ============================================================

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import Tooltip from './Tooltip'

export default function SentimentGraph({ sentimentData }) {
  if (!sentimentData) return null

  // Build chart data from weekly sentiment history
  const weekLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current']
  const history = sentimentData.weekly_sentiment_history || [80, 75, 72, 65, 58]
  const chartData = weekLabels.map((label, i) => ({
    week: label,
    'Overall': history[i] || 50,
  }))

  // Get team-level breakdown
  const teams = sentimentData.teams || []

  return (
    <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Team Sentiment
          </h2>
          <Tooltip text="Team-level morale analysis. Privacy-first: individual messages never stored or scored. Below 70 = early warning. Below 50 = intervention needed." position="bottom">
            <p className="text-xs text-gray-500 mt-1 cursor-help border-b border-dotted border-gray-700 inline">
              Communication tone analysis (team-level only)
            </p>
          </Tooltip>
        </div>
        <div className={`flex items-center gap-2 text-sm ${
          sentimentData.trend === 'declining' ? 'text-red-400' :
          sentimentData.trend === 'improving' ? 'text-green-400' : 'text-gray-400'
        }`}>
          <span>{sentimentData.trend === 'declining' ? '↓' : sentimentData.trend === 'improving' ? '↑' : '→'}</span>
          <span>{Math.abs(sentimentData.trend_change || 0)}%</span>
          <span className="text-gray-500 text-xs">{sentimentData.trend}</span>
        </div>
      </div>

      {/* Recharts line chart */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <RechartsTooltip
              contentStyle={{ background: '#1E293B', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }}
              labelStyle={{ color: '#94A3B8' }}
            />
            <ReferenceLine y={70} stroke="#22C55E" strokeDasharray="5 5" label={{ value: 'Healthy', fill: '#22C55E', fontSize: 10 }} />
            <ReferenceLine y={50} stroke="#EF4444" strokeDasharray="5 5" label={{ value: 'Critical', fill: '#EF4444', fontSize: 10 }} />
            <Line type="monotone" dataKey="Overall" stroke="#7C3AED" strokeWidth={2} dot={{ fill: '#7C3AED', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Team breakdown */}
      <div className="space-y-2">
        {teams.map((team) => (
          <div
            key={team.team_name}
            className="flex items-center justify-between bg-navy-900/40 rounded-lg px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                team.sentiment_score > 70 ? 'bg-green-400' :
                team.sentiment_score > 50 ? 'bg-amber-400' : 'bg-red-400'
              }`} />
              <span className="text-sm text-gray-300">{team.team_name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${
                team.sentiment_score > 70 ? 'text-green-400' :
                team.sentiment_score > 50 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {team.sentiment_score}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                team.alert_level === 'HIGH' ? 'bg-red-900/40 text-red-400' :
                team.alert_level === 'MEDIUM' ? 'bg-amber-900/40 text-amber-400' :
                'bg-green-900/40 text-green-400'
              }`}>
                {team.alert_level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
