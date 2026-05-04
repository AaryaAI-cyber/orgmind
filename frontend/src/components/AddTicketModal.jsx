import { useState } from 'react'

export default function AddTicketModal({ teamNames, teamMembers, projectPrefix, onSubmit, onClose }) {
  const [title, setTitle] = useState('')
  const [team, setTeam] = useState(teamNames[0] || '')
  const [assignee, setAssignee] = useState('')
  const [status, setStatus] = useState('In Progress')
  const [daysSinceUpdate, setDaysSinceUpdate] = useState(0)
  const [storyPoints, setStoryPoints] = useState(3)

  const ticketId = `${projectPrefix}-${Math.floor(Math.random() * 900) + 200}`
  const members = teamMembers[team] || ['Team Member']

  const handleSubmit = (e) => {
    e.preventDefault()
    const today = new Date()
    onSubmit({
      ticket_id: ticketId,
      title: title || 'New ticket',
      assignee: assignee || members[0],
      team,
      status,
      priority: daysSinceUpdate >= 5 ? 'HIGH' : 'MEDIUM',
      story_points: storyPoints,
      created_date: new Date(today - (daysSinceUpdate + 3) * 86400000).toISOString().split('T')[0],
      last_updated: new Date(today - daysSinceUpdate * 86400000).toISOString().split('T')[0],
      sprint: 'Current Sprint',
      labels: [],
      description: title,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-navy-800 rounded-xl border border-navy-700 p-6 w-full max-w-md">
        <h3 className="text-white font-bold text-lg mb-4">Add Ticket</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Ticket ID</label>
            <input value={ticketId} disabled className="input-field opacity-60" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ticket title" className="input-field" />
          </div>
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
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-400">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="input-field">
                {['Todo', 'In Progress', 'Blocked', 'Done'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Days Since Update</label>
              <input type="number" value={daysSinceUpdate} onChange={e => setDaysSinceUpdate(+e.target.value)} min={0} className="input-field" />
            </div>
            <div>
              <label className="text-xs text-gray-400">Story Points</label>
              <input type="number" value={storyPoints} onChange={e => setStoryPoints(+e.target.value)} min={1} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Ticket</button>
          </div>
        </form>
      </div>
    </div>
  )
}
