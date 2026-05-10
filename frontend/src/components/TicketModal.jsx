// TicketModal.jsx
// ============================================================
// ITIL-standard ticket creator with P1-P4 priority levels,
// 5 ITIL ticket types (Incident, Service Request, Problem,
// Change Request, Event), impact scope, Fibonacci story
// points, and smart auto-suggest from title keywords.
// ============================================================

import { useState, useMemo } from 'react'
import Tooltip from './Tooltip'

// ITIL ticket types with icons, descriptions, and examples
const ITIL_TYPES = [
  { id: 'Incident', icon: '🔴', label: 'Incident', desc: 'Something is broken, restore service fast', examples: 'System down, app crash, outage, login failure, network issue' },
  { id: 'Service Request', icon: '📋', label: 'Service Request', desc: 'Routine request, not break/fix', examples: 'Password reset, software install, access request, onboarding' },
  { id: 'Problem', icon: '🔍', label: 'Problem', desc: 'Find root cause of recurring incidents', examples: 'Recurring bug investigation, post-incident analysis, root cause' },
  { id: 'Change Request', icon: '🔄', label: 'Change Request', desc: 'Planned modification', examples: 'Server upgrade, production deploy, config change, new release' },
  { id: 'Event', icon: '📡', label: 'Event', desc: 'System-triggered alert', examples: 'CPU spike, memory threshold, security alert, monitoring alert' },
]

// ITIL P1-P4 priorities with SLA response times
const PRIORITIES = [
  { id: 'P1', color: 'bg-red-500', textColor: 'text-red-400', label: 'P1 Critical', desc: 'Business-critical, no workaround', sla: 'Respond in 15 minutes' },
  { id: 'P2', color: 'bg-orange-500', textColor: 'text-orange-400', label: 'P2 High', desc: 'Major functionality broken, limited workaround', sla: 'Respond in 1 hour' },
  { id: 'P3', color: 'bg-amber-500', textColor: 'text-amber-400', label: 'P3 Medium', desc: 'Single user/team affected, workaround available', sla: 'Respond in 4 hours' },
  { id: 'P4', color: 'bg-green-500', textColor: 'text-green-400', label: 'P4 Low', desc: 'Minor inconvenience, standard service request', sla: 'Respond within 1 business day' },
]

// Impact scope options
const IMPACTS = [
  { id: 'Organization-wide', icon: '🏢', label: 'Organization-wide' },
  { id: 'Department', icon: '👥', label: 'Department' },
  { id: 'Single User', icon: '👤', label: 'Single User' },
  { id: 'Infrastructure', icon: '🔧', label: 'Infrastructure' },
]

// Fibonacci story points used in Agile/Scrum
const FIBONACCI_POINTS = [1, 2, 3, 5, 8, 13, 21]

// Smart auto-suggest rules: keywords in title -> suggested type + priority
function getAutoSuggestion(title) {
  const lower = title.toLowerCase()
  if (/down|crash|broken|outage|not working|failed|failing/.test(lower)) {
    return { type: 'Incident', priority: 'P1', label: 'Incident · P1' }
  }
  if (/request|need|install|access|please|onboard/.test(lower)) {
    return { type: 'Service Request', priority: 'P4', label: 'Service Request · P4' }
  }
  if (/recurring|again|root cause|keeps|investigating/.test(lower)) {
    return { type: 'Problem', priority: 'P2', label: 'Problem · P2' }
  }
  if (/upgrade|deploy|release|change|update|migration/.test(lower)) {
    return { type: 'Change Request', priority: 'P3', label: 'Change Request · P3' }
  }
  if (/alert|spike|threshold|monitoring|cpu|memory/.test(lower)) {
    return { type: 'Event', priority: 'P2', label: 'Event · P2' }
  }
  return null
}

export default function TicketModal({ teamNames, teamMembers, projectPrefix, onSubmit, onClose }) {
  const [itilType, setItilType] = useState('Incident')
  const [priority, setPriority] = useState('P2')
  const [impact, setImpact] = useState('Department')
  const [title, setTitle] = useState('')
  const [assignee, setAssignee] = useState('')
  const [team, setTeam] = useState(teamNames[0] || '')
  const [storyPoints, setStoryPoints] = useState(5)
  const [daysSinceUpdate, setDaysSinceUpdate] = useState(0)

  // Auto-generated ticket ID
  const ticketId = `${projectPrefix}-${Math.floor(Math.random() * 900) + 200}`

  // Members for selected team
  const members = teamMembers[team] || ['Team Member']

  // Smart auto-suggest from title
  const suggestion = useMemo(() => getAutoSuggestion(title), [title])

  // Apply auto-suggestion
  const applySuggestion = () => {
    if (suggestion) {
      setItilType(suggestion.type)
      setPriority(suggestion.priority)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const today = new Date()
    onSubmit({
      ticket_id: ticketId,
      itil_type: itilType,
      title: title || 'New ticket',
      assignee: assignee || members[0],
      team,
      status: 'In Progress',
      priority,
      impact,
      story_points: storyPoints,
      days_stuck: daysSinceUpdate,
      created_date: new Date(today - (daysSinceUpdate + 3) * 86400000).toISOString().split('T')[0],
      last_updated: new Date(today - daysSinceUpdate * 86400000).toISOString().split('T')[0],
      sprint: 'Current Sprint',
      labels: [],
      description: title,
      mentioned_in_slack: false,
      escalated: false,
      sla_breached: daysSinceUpdate >= 1 && priority === 'P1',
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
      <div className="bg-navy-800 rounded-xl border border-navy-700 p-6 w-full max-w-lg my-auto">
        <h3 className="text-white font-bold text-lg mb-4">Create New Ticket</h3>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ITIL Ticket Type */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Ticket Type (ITIL)</label>
            <div className="grid grid-cols-1 gap-2">
              {ITIL_TYPES.map(t => (
                <Tooltip key={t.id} text={`${t.desc}. Examples: ${t.examples}`} position="right">
                  <button type="button"
                    onClick={() => setItilType(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all ${
                      itilType === t.id
                        ? 'bg-amd-purple/20 border border-amd-purple/50 text-white'
                        : 'bg-navy-900/40 border border-navy-700 text-gray-400 hover:border-navy-600'
                    }`}>
                    <span>{t.icon}</span>
                    <div>
                      <span className="font-medium">{t.label}</span>
                      <span className="text-xs text-gray-500 ml-2">{t.desc}</span>
                    </div>
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Title with smart auto-suggest */}
          <div>
            <label className="text-xs text-gray-400">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Describe the issue..."
              className="input-field" />
            {suggestion && title.length > 3 && (
              <button type="button" onClick={applySuggestion}
                className="mt-1 text-xs text-amd-purple-light hover:text-white transition-colors">
                💡 Suggested: {suggestion.label} <span className="text-gray-500 ml-1">[Use this ↗]</span>
              </button>
            )}
          </div>

          {/* Priority P1-P4 */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Priority (ITIL SLA)</label>
            <div className="grid grid-cols-2 gap-2">
              {PRIORITIES.map(p => (
                <Tooltip key={p.id} text={`${p.desc}. SLA: ${p.sla}`} position="bottom">
                  <button type="button"
                    onClick={() => setPriority(p.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      priority === p.id
                        ? 'bg-amd-purple/20 border border-amd-purple/50 text-white'
                        : 'bg-navy-900/40 border border-navy-700 text-gray-400 hover:border-navy-600'
                    }`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                    <div>
                      <span className="font-medium">{p.id}</span>
                      <span className="text-xs text-gray-500 ml-1">{p.sla}</span>
                    </div>
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Impact Scope</label>
            <div className="grid grid-cols-4 gap-2">
              {IMPACTS.map(im => (
                <button key={im.id} type="button"
                  onClick={() => setImpact(im.id)}
                  className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs transition-all ${
                    impact === im.id
                      ? 'bg-amd-purple/20 border border-amd-purple/50 text-white'
                      : 'bg-navy-900/40 border border-navy-700 text-gray-400 hover:border-navy-600'
                  }`}>
                  <span>{im.icon}</span>
                  <span className="text-center leading-tight">{im.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Team + Assignee */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400">Team</label>
              <select value={team} onChange={e => { setTeam(e.target.value); setAssignee('') }} className="input-field">
                {teamNames.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Assignee</label>
              <select value={assignee} onChange={e => setAssignee(e.target.value)} className="input-field">
                <option value="">Select...</option>
                {members.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Story Points + Days Since Update */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Tooltip text="Fibonacci numbers reflect growing uncertainty. A 13-point task isn't just bigger than 8 — it's fundamentally more uncertain. Standard in Agile/Scrum at TCS, Infosys, Accenture, and all major MNCs." position="top">
                <label className="text-xs text-gray-400 cursor-help border-b border-dotted border-gray-600">Story Points (Fibonacci)</label>
              </Tooltip>
              <select value={storyPoints} onChange={e => setStoryPoints(+e.target.value)} className="input-field mt-1">
                {FIBONACCI_POINTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Days Since Last Update</label>
              <input type="number" value={daysSinceUpdate} onChange={e => setDaysSinceUpdate(+e.target.value)} min={0} className="input-field mt-1" />
            </div>
          </div>

          {/* Ticket ID (auto-generated) */}
          <div>
            <label className="text-xs text-gray-400">Ticket ID (auto-generated)</label>
            <input value={ticketId} disabled className="input-field opacity-60" />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Ticket →</button>
          </div>
        </form>
      </div>
    </div>
  )
}
