// Helper to format seconds into "days, hours, min"
export function formatDuration(seconds: number): string {
    const days = Math.floor(seconds / 86400)
    seconds %= 86400
    const hours = Math.floor(seconds / 3600)
    seconds %= 3600
    const minutes = Math.floor(seconds / 60)
  
    const parts: string[] = []
    if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`)
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`)
    if (minutes > 0) parts.push(`${minutes} min`)
  
    return parts.join(", ") || "less than 1 min"
  }
  
  