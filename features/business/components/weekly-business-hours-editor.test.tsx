import { describe, expect, test } from "bun:test"
import {
  buildReplaceBusinessHoursPayload,
  buildWeeklyBusinessHoursEditorRows,
} from "@/features/business/components/weekly-business-hours-editor"

describe("buildWeeklyBusinessHoursEditorRows", () => {
  test("preserves existing API hours and fills missing days with owner defaults", () => {
    const rows = buildWeeklyBusinessHoursEditorRows([
      { dayOfWeek: 1, openTime: "09:30", closeTime: "18:15", isClosed: false },
      { dayOfWeek: 3, isClosed: true },
    ])

    expect(rows).toHaveLength(7)
    expect(rows.map((row) => row.dayName)).toEqual([
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ])
    expect(rows[1]).toEqual({
      dayOfWeek: 1,
      dayName: "Monday",
      opensAt: "09:30",
      closesAt: "18:15",
      isClosed: false,
    })
    expect(rows[3]).toEqual({
      dayOfWeek: 3,
      dayName: "Wednesday",
      opensAt: "10:00",
      closesAt: "21:00",
      isClosed: true,
    })
    expect(rows[0]).toEqual({
      dayOfWeek: 0,
      dayName: "Sunday",
      opensAt: "10:00",
      closesAt: "21:00",
      isClosed: false,
    })
  })
})

describe("buildReplaceBusinessHoursPayload", () => {
  test("keeps open-day times and strips them for closed days", () => {
    const payload = buildReplaceBusinessHoursPayload([
      {
        dayOfWeek: 4,
        dayName: "Thursday",
        opensAt: "08:00",
        closesAt: "20:00",
        isClosed: false,
      },
      {
        dayOfWeek: 5,
        dayName: "Friday",
        opensAt: "11:00",
        closesAt: "22:30",
        isClosed: true,
      },
    ])

    expect(payload).toEqual({
      hours: [
        {
          dayOfWeek: 4,
          isClosed: false,
          openTime: "08:00",
          closeTime: "20:00",
        },
        {
          dayOfWeek: 5,
          isClosed: true,
          openTime: undefined,
          closeTime: undefined,
        },
      ],
    })
  })
})
