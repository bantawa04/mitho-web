"use client"

import * as React from "react"
import { useReplaceBusinessHours } from "@/hooks/use-businesses"
import { MithoButton } from "@/components/mitho/mitho-button"
import { ToggleSwitch } from "@/components/mitho/mitho-toggle-switch"
import type { BusinessHour, ReplaceHoursPayload } from "@/types/business"

export type WeeklyBusinessHoursEditorRow = {
  dayOfWeek: number
  dayName: string
  opensAt: string
  closesAt: string
  isClosed: boolean
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const DEFAULT_OPEN_TIME = "10:00"
const DEFAULT_CLOSE_TIME = "21:00"

export function buildWeeklyBusinessHoursEditorRows(apiData: BusinessHour[]): WeeklyBusinessHoursEditorRow[] {
  const byDay = new Map(apiData.map((hour) => [hour.dayOfWeek, hour]))
  return DAY_NAMES.map((dayName, dayOfWeek) => {
    const existing = byDay.get(dayOfWeek)
    if (existing) {
      return {
        dayOfWeek,
        dayName,
        opensAt: existing.openTime ?? DEFAULT_OPEN_TIME,
        closesAt: existing.closeTime ?? DEFAULT_CLOSE_TIME,
        isClosed: existing.isClosed,
      }
    }
    return {
      dayOfWeek,
      dayName,
      opensAt: DEFAULT_OPEN_TIME,
      closesAt: DEFAULT_CLOSE_TIME,
      isClosed: false,
    }
  })
}

export function buildReplaceBusinessHoursPayload(rows: WeeklyBusinessHoursEditorRow[]): ReplaceHoursPayload {
  return {
    hours: rows.map((row) => ({
      dayOfWeek: row.dayOfWeek,
      isClosed: row.isClosed,
      openTime: row.isClosed ? undefined : row.opensAt,
      closeTime: row.isClosed ? undefined : row.closesAt,
    })),
  }
}

export function WeeklyBusinessHoursEditor({
  businessId,
  initialHours,
  hideHeader = false,
}: {
  businessId: string
  initialHours: BusinessHour[]
  hideHeader?: boolean
}) {
  const [rows, setRows] = React.useState<WeeklyBusinessHoursEditorRow[]>(() =>
    buildWeeklyBusinessHoursEditorRows(initialHours),
  )
  const { mutate: replaceHours, isPending, isError, isSuccess, reset } = useReplaceBusinessHours(businessId)

  function updateRow(index: number, update: Partial<WeeklyBusinessHoursEditorRow>) {
    if (isSuccess || isError) reset()
    setRows((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...update } : item)))
  }

  function handleSave() {
    replaceHours(buildReplaceBusinessHoursPayload(rows))
  }

  return (
    <section>
      {!hideHeader ? (
        <div className="mb-4">
          <h2 className="type-section-title text-foreground">Weekly schedule</h2>
          <p className="type-meta mt-1">Update open and close times here, then save the full schedule in one pass.</p>
        </div>
      ) : null}

      <div className="divide-y divide-border rounded-lg border border-border bg-white">
        {rows.map((item, index) => (
          <div
            key={item.dayOfWeek}
            className="grid gap-4 px-4 py-3 md:grid-cols-[140px_minmax(0,1fr)_minmax(0,1fr)_120px] md:px-6"
          >
            <div className="flex items-center">
              <p className="text-sm font-semibold text-foreground">{item.dayName}</p>
            </div>

            <label className="space-y-2">
              <span className="block text-xs font-semibold text-muted-foreground">Opens</span>
              <input
                type="time"
                value={item.opensAt}
                onChange={(event) => updateRow(index, { opensAt: event.target.value })}
                disabled={item.isClosed || isPending}
                className="w-full rounded-lg border border-border bg-surface-business-inset px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>

            <label className="space-y-2">
              <span className="block text-xs font-semibold text-muted-foreground">Closes</span>
              <input
                type="time"
                value={item.closesAt}
                onChange={(event) => updateRow(index, { closesAt: event.target.value })}
                disabled={item.isClosed || isPending}
                className="w-full rounded-lg border border-border bg-surface-business-inset px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </label>

            <div className="flex items-end md:justify-end">
              <ToggleSwitch
                checked={item.isClosed}
                onCheckedChange={(checked) => updateRow(index, { isClosed: checked })}
                label="Closed"
                disabled={isPending}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {isSuccess ? <span className="text-sm font-medium text-success">Hours saved.</span> : null}
        {isError ? <span className="text-sm font-medium text-danger">Something went wrong. Please try again.</span> : null}
        <MithoButton type="button" size="sm" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : "Save hours"}
        </MithoButton>
      </div>
    </section>
  )
}
