const STORAGE_KEY = 'orgmind_user_session'

export function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveSession(session) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...session, _savedAt: Date.now() }))
  } catch { /* quota exceeded */ }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}
