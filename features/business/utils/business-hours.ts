import type { BusinessHour } from "@/types/business"

export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export type BusinessHoursTone = "open" | "closed"

export interface BusinessHoursStatus {
  isOpen: boolean | null
  label: string | null
  tone: BusinessHoursTone
}

// "Now" as Kathmandu wall-clock time — the product is Nepal-first, so open/closed
// must be computed in Asia/Kathmandu, not the viewer's local timezone.
export function getNepalNow(): { dayOfWeek: number; minutes: number } {
  const kathmandu = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kathmandu" }))
  return { dayOfWeek: kathmandu.getDay(), minutes: kathmandu.getHours() * 60 + kathmandu.getMinutes() }
}

export function formatBusinessTime(value?: string): string {
  if (!value) return "Not provided"
  const [hourPart, minutePart = "00"] = value.split(":")
  const hour = Number(hourPart)
  if (Number.isNaN(hour)) return value
  const period = hour >= 12 ? "PM" : "AM"
  const normalizedHour = hour % 12 || 12
  return `${normalizedHour}:${minutePart.padStart(2, "0")} ${period}`
}

function parseMinutes(value: string): number {
  const [hour = "0", minute = "0"] = value.split(":")
  return Number(hour) * 60 + Number(minute)
}

// Resolves the live open/closed status with a human label, handling overnight
// spans (close <= open), 24-hour days, before-open today, and the next opening.
export function computeBusinessHoursStatus(hours: BusinessHour[] | undefined): BusinessHoursStatus {
  if (!hours?.length) return { isOpen: null, label: null, tone: "closed" }

  const { dayOfWeek, minutes } = getNepalNow()
  const today = hours.find((hour) => hour.dayOfWeek === dayOfWeek)

  if (today && !today.isClosed && today.openTime && today.closeTime) {
    const open = parseMinutes(today.openTime)
    const close = parseMinutes(today.closeTime)

    if (open === close) {
      return { isOpen: true, label: "Open 24 hours", tone: "open" }
    }

    const overnight = close < open
    const openNow = overnight ? minutes >= open || minutes < close : minutes >= open && minutes < close
    if (openNow) {
      return { isOpen: true, label: `Open until ${formatBusinessTime(today.closeTime)}`, tone: "open" }
    }

    if (!overnight && minutes < open) {
      return { isOpen: false, label: `Closed · Opens ${formatBusinessTime(today.openTime)}`, tone: "closed" }
    }
  }

  const next = findNextOpening(hours, dayOfWeek)
  if (next) {
    const when = next.offset === 1 ? "tomorrow " : `${DAY_SHORT[next.dayOfWeek]} `
    return { isOpen: false, label: `Closed · Opens ${when}${formatBusinessTime(next.openTime)}`, tone: "closed" }
  }

  return { isOpen: false, label: "Closed", tone: "closed" }
}

function findNextOpening(hours: BusinessHour[], todayDayOfWeek: number) {
  for (let offset = 1; offset <= 7; offset++) {
    const dayOfWeek = (todayDayOfWeek + offset) % 7
    const day = hours.find((hour) => hour.dayOfWeek === dayOfWeek)
    if (day && !day.isClosed && day.openTime) {
      return { dayOfWeek, openTime: day.openTime, offset }
    }
  }
  return null
}
