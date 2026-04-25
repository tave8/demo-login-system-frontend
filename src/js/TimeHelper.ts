export default class TimeHelper {
  public static toRelativeTime(dateStr: string): string {
    const date = new Date(dateStr)

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: '${dateStr}'`)
    }

    const diff = Date.now() - date.getTime()
    const minutes = Math.floor(diff / 1000 / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (years >= 1) return `${years}y ago`
    if (months >= 1) return `${months}mo ago`
    if (days >= 1) return `${days}d ago`
    if (hours >= 1) return `${hours}h ago`
    return `${minutes}m ago`
  }
}
