import { Clock } from "lucide-react"
import { MithoCard, MithoCardContent, MithoCardHeader, MithoCardTitle } from "@/components/mitho/mitho-card"
import { cn } from "@/lib/utils"
import type { BusinessVisitInfo } from "@/features/business/business-detail-types"

interface BusinessHoursCardProps {
  hours: BusinessVisitInfo["hours"]
  status?: BusinessVisitInfo["hoursStatus"]
  todayDayOfWeek?: number
  className?: string
}

export function BusinessHoursCard({ hours, status, todayDayOfWeek, className }: BusinessHoursCardProps) {
  return (
    <MithoCard surface="customer" interactive="none" className={className}>
      <MithoCardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
            <Clock className="h-5 w-5 text-brand-orange" />
          </div>
          <div>
            <MithoCardTitle>Hours</MithoCardTitle>
            {status ? (
              <p
                className={cn(
                  "mt-1 text-sm font-semibold",
                  status.tone === "open" ? "text-emerald-600" : "text-muted-foreground",
                )}
              >
                {status.label}
              </p>
            ) : null}
          </div>
        </div>
      </MithoCardHeader>
      <MithoCardContent>
        {hours.length > 0 ? (
          <ul className="divide-y divide-border">
            {hours.map((schedule) => {
              const isToday = schedule.dayOfWeek === todayDayOfWeek
              return (
                <li
                  key={schedule.dayOfWeek}
                  className={cn(
                    "flex items-center justify-between gap-4 py-2.5 text-sm",
                    isToday ? "font-semibold text-brand-dark-green" : "text-muted-foreground",
                  )}
                >
                  <span>{schedule.day}</span>
                  <span className={cn(isToday ? "text-brand-dark-green" : "text-foreground/80")}>{schedule.time}</span>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Hours not listed yet.</p>
        )}
      </MithoCardContent>
    </MithoCard>
  )
}
