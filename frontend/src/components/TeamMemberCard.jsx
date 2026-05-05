// TeamMemberCard.jsx
// ============================================================
// Individual team member profile card showing:
// - Name + role badge
// - Utilization % with color-coded progress bar
// - Skills as tag pills
// - Ticket count this sprint
// - Status dot: Available (<70%) / Busy (70-90%) / Overloaded (>90%)
// ============================================================

export default function TeamMemberCard({ member }) {
  // Determine utilization color and status based on percentage
  const getUtilColor = (pct) => {
    if (pct > 90) return { bar: 'bg-red-500', text: 'text-red-400', dot: '🔴', status: 'Overloaded' }
    if (pct > 70) return { bar: 'bg-amber-500', text: 'text-amber-400', dot: '🟡', status: 'Busy' }
    return { bar: 'bg-green-500', text: 'text-green-400', dot: '🟢', status: 'Available' }
  }

  const util = getUtilColor(member.utilization)

  return (
    <div className="bg-navy-900/40 rounded-lg p-3 border border-navy-700/50 hover:border-navy-600 transition-colors">
      {/* Name + status dot */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs">{util.dot}</span>
        <span className="text-sm text-white font-medium truncate">{member.name}</span>
      </div>

      {/* Role */}
      <p className="text-xs text-gray-500 mb-2 pl-5">{member.role}</p>

      {/* Utilization bar */}
      <div className="mb-2 pl-5">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500">Utilization</span>
          <span className={util.text}>{member.utilization}%</span>
        </div>
        <div className="w-full bg-navy-800 rounded-full h-1.5">
          <div className={`h-1.5 rounded-full transition-all ${util.bar}`} style={{ width: `${Math.min(member.utilization, 100)}%` }} />
        </div>
      </div>

      {/* Skills as tag pills */}
      {member.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1 pl-5">
          {member.skills.map(skill => (
            <span key={skill} className="px-1.5 py-0.5 bg-navy-700/60 text-gray-400 text-[10px] rounded">
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Ticket count */}
      <p className="text-[10px] text-gray-600 pl-5">{member.ticketCount || 0} tickets this sprint</p>
    </div>
  )
}
