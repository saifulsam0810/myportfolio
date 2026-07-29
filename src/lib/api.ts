// Helper to safely parse JSON string fields from Prisma (SQLite stores as text)
export function parseJSON<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

// Serialize object to JSON string for Prisma storage
export function stringifyJSON(value: unknown): string {
  return JSON.stringify(value)
}

// Standard API response helpers
export function ok(data: unknown, init?: ResponseInit) {
  return Response.json(data, init)
}

export function err(message: string, status = 400) {
  return Response.json({ error: message }, { status })
}
