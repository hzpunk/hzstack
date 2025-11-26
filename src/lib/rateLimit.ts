const attempts = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(ip: string, limit = 5, windowMs = 60 * 1000): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const record = attempts.get(ip)

  if (!record || now > record.resetTime) {
    // Новое окно или первая попытка
    attempts.set(ip, { count: 1, resetTime: now + windowMs })
    return { allowed: true }
  }

  if (record.count >= limit) {
    return { allowed: false, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true }
}
