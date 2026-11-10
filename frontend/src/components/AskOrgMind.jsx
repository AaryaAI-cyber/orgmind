import { useState } from 'react'
import axios from 'axios'

export default function AskOrgMind({ apiBase, demoMode, projectName, teamNames, deadline, onLogUpdate }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const suggestedQuestions = [
    `What's blocking ${projectName || 'the project'}?`,
    teamNames?.length ? `How is ${teamNames[0]} doing?` : 'Which team needs the most help?',
    deadline ? `Will ${projectName || 'we'} meet the ${deadline} deadline?` : 'Will we make the deadline?',
    "What's the biggest risk right now?",
  ]

  const askQuestion = async (q) => {
    const questionText = q || question
    if (!questionText.trim()) return

    setMessages((prev) => [...prev, { role: 'user', text: questionText }])
    setQuestion('')
    setLoading(true)

    try {
      const response = await axios.post(`${apiBase}/chat`, { question: questionText })
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: response.data.answer, score: response.data.org_health_score },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Error: Could not reach OrgMind backend. Please check the connection.', error: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-navy-800 rounded-xl border border-navy-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Ask OrgMind
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Ask anything about your organization's health
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onLogUpdate && (
            <button onClick={onLogUpdate}
              className="px-2 py-1 rounded text-xs text-amd-purple-light border border-amd-purple/30 hover:bg-amd-purple/10 transition-colors">
              + Log Team Update
            </button>
          )}
          {demoMode && (
            <span className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded">Demo Mode</span>
          )}
        </div>
      </div>

      {/* Suggested questions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestedQuestions.map((sq) => (
          <button
            key={sq}
            onClick={() => askQuestion(sq)}
            disabled={loading}
            className="px-3 py-1.5 bg-navy-900/60 border border-navy-700 rounded-full text-xs text-gray-300 hover:border-amd-purple hover:text-amd-purple-light transition-colors disabled:opacity-50"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Chat messages */}
      {messages.length > 0 && (
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-amd-purple/20 border border-amd-purple/30 text-gray-200'
                  : msg.error
                    ? 'bg-red-900/20 border border-red-500/30 text-red-300'
                    : 'bg-navy-900/60 border border-navy-700 text-gray-300'
              }`}>
                {msg.role === 'assistant' && !msg.error && (
                  <div className="flex items-center gap-2 mb-2 text-xs text-amd-purple-light">
                    <span>OrgMind</span>
                    {!demoMode && <span className="text-gray-600">via AMD MI300X</span>}
                  </div>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center gap-2 mb-4 text-sm text-amd-purple-light pulse-glow">
          <span>Analyzing on {demoMode ? 'Demo Engine' : 'AMD MI300X'}...</span>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
          placeholder="Ask OrgMind anything about your org..."
          disabled={loading}
          className="flex-1 bg-navy-900 border border-navy-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amd-purple transition-colors disabled:opacity-50"
        />
        <button
          onClick={() => askQuestion()}
          disabled={loading || !question.trim()}
          className="px-4 py-2.5 bg-amd-purple hover:bg-amd-purple-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ask
        </button>
      </div>
    </div>
  )
}
