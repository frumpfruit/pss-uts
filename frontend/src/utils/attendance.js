/**
 * Utility functions for attendance validation and status checks
 */

/**
 * Checks if an attendance session's deadline has passed.
 * Returns true if:
 * 1. Status is explicitly 'CLOSED' or closed_at is set.
 * 2. Session date is strictly before today.
 * 3. Session date is today and current time >= session.end_time (e.g. '11:10').
 */
export function isSessionExpired(session) {
  if (!session) return true
  if (session.status === 'CLOSED' || session.closed_at) return true

  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const todayStr = `${year}-${month}-${day}` // Local 'YYYY-MM-DD'

  // Past date check
  if (session.date && session.date < todayStr) {
    return true
  }

  // Same-day time check (e.g. session.end_time = '11:10')
  if (session.date === todayStr && session.end_time) {
    try {
      const parts = session.end_time.split(':').map(Number)
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        const [endHour, endMin] = parts
        const currentHour = now.getHours()
        const currentMin = now.getMinutes()
        if (currentHour > endHour || (currentHour === endHour && currentMin >= endMin)) {
          return true
        }
      }
    } catch {
      // Ignore parse failure
    }
  }

  return false
}
