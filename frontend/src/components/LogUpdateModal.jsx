import { useState } from 'react'

export default function LogUpdateModal({ teamNames, onSubmit, onClose }) {
  const [team, setTeam] = useState(teamNames[0] || '')
  const [message, setMessage] = useState('')
  const [sentiment, setSentiment] = useState('Neutral')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      author: 'You',
      team,
      channel: `#${team.toLowerCase().replace(/\s+/g, '-')}`,
      text: message || 'Team update',
      timestamp: new Date().toISOString(),
      reactions: { thumbsup: 0, eyes: 0 },
      _sentimentTag: sentiment,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-navy-800 rounded-xl border border-navy-700 p-6 w-full max-w-md">
        <h3 className="text-white font-bold text-lg mb-4">Log Team Update</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400">Team</label>
            <select value={team} onChange={e => setTeam(e.target.value)} className="input-field">
              {teamNames.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
              placeholder="Still blocked on auth service, 3rd day waiting..."
              className="input-field resize-none" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Sentiment</label>
            <select value={sentiment} onChange={e => setSentiment(e.target.value)} className="input-field">
              {['Positive', 'Neutral', 'Frustrated', 'Blocked'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Log Update</button>
          </div>
        </form>
      </div>
    </div>
  )
}
