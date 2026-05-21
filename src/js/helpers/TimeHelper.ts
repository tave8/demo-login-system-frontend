export default class TimeHelper {

  public static today(): string {
    return TimeHelper.toISODate(new Date())
  }

  public static startOfWeek(): string {
    const date = new Date()
    const day = date.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday

    // if Sunday (0), go back 6 days to get Monday; otherwise go back to Monday
    const diff = day === 0 ? -6 : 1 - day

    date.setDate(date.getDate() + diff)
    return TimeHelper.toISODate(date)
  }

  public static endOfWeek(): string {
    const date = new Date()
    const day = date.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday

    // if Sunday (0), stay on same day; otherwise go forward to Sunday
    const diff = day === 0 ? 0 : 7 - day

    date.setDate(date.getDate() + diff)
    return TimeHelper.toISODate(date)
  }

  public static toISODate(date: Date): string {
    // split on "T" to drop the time portion: "2026-05-14T08:30:00.000Z" → "2026-05-14"
    return date.toISOString().split("T")[0]
  }


  public static toRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: '${dateStr}'`);
    }

    const diff = Date.now() - date.getTime();

    // Handle future dates or instantaneous rendering safely
    if (diff < 1000) return "Adesso";

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years >= 1) {
      return years === 1 ? "1 anno fa" : `${years} anni fa`;
    }
    if (months >= 1) {
      return months === 1 ? "1 mese fa" : `${months} mesi fa`;
    }
    if (days >= 1) {
      return days === 1 ? "Ieri" : `${days} giorni fa`; // "Ieri" reads much better than "1 giorno fa"
    }
    if (hours >= 1) {
      return hours === 1 ? "1 ora fa" : `${hours} ore fa`;
    }
    if (minutes >= 1) {
      return minutes === 1 ? "1 minuto fa" : `${minutes} minuti fa`;
    }

    return seconds === 1 ? "1 secondo fa" : `${seconds} secondi fa`;
  }
}
