export function formatChartDate(dateString: string): string {
  try {
    // Extract just the date part from ISO string (YYYY-MM-DD)
    const datePart = dateString.split('T')[0]; // "2026-03-08"
    const [year, month, day] = datePart.split('-').map(Number);
    
    // Create a date using UTC to avoid timezone conversion
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateString;
  }
}
