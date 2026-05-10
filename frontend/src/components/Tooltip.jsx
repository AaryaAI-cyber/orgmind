// Tooltip.jsx
// ============================================================
// Reusable tooltip component.
// Shows on hover (mouseover) after 300ms delay.
// Dark background, white text, max-width 280px.
// Arrow pointing to the element.
// Never blocks clicks.
// ============================================================

import { useState, useRef, useCallback } from 'react'

export default function Tooltip({ children, text, position = 'top' }) {
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)

  // Show tooltip after 300ms delay
  const handleMouseEnter = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), 300)
  }, [])

  // Hide tooltip and clear any pending timer
  const handleMouseLeave = useCallback(() => {
    clearTimeout(timerRef.current)
    setVisible(false)
  }, [])

  // Position classes for tooltip placement
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  // Arrow classes matching tooltip position
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-t-transparent border-b-transparent border-l-transparent',
  }

  return (
    <div className="relative inline-flex" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      {visible && text && (
        <div className={`absolute z-50 pointer-events-none ${positionClasses[position]}`}>
          <div className="bg-gray-900 text-white text-xs leading-relaxed rounded-lg px-3 py-2 max-w-[280px] shadow-lg border border-gray-700 whitespace-normal">
            {text}
            <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
          </div>
        </div>
      )}
    </div>
  )
}
