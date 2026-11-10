import { useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const colors = type === 'success' ? 'bg-green-900/80 border-green-500/50 text-green-200'
    : type === 'info' ? 'bg-blue-900/80 border-blue-500/50 text-blue-200'
    : 'bg-red-900/80 border-red-500/50 text-red-200'

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg border text-sm font-medium shadow-xl transition-all animate-slide-up ${colors}`}>
      {message}
    </div>
  )
}
