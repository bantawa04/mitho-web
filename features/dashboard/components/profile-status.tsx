"use client"

import { CheckCircle2, Circle, ArrowRight } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent, MithoCardFooter } from "@/components/mitho/mitho-card"
import { MithoButton } from "@/components/mitho/mitho-button"
import { MithoProgress } from "@/components/mitho/mitho-progress"

export function ProfileStatus() {
  const completionPercentage = 75
  const tasks = [
    { label: "Add menu items", completed: true },
    { label: "Upload photos", completed: true },
    { label: "Update opening hours", completed: true },
    { label: "Verify location", completed: false },
  ]

  return (
    <section>
      <p className="mb-2 text-xs font-semibold text-muted-foreground">Readiness</p>
      <h2 className="type-section-title mb-4 text-foreground">Business profile status</h2>
      <MithoCard surface="business" interactive="none" className="rounded-lg border-border bg-white shadow-sm">
        <MithoCardHeader className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="type-card-title text-foreground">Profile completion</h3>
              <p className="type-meta">Complete your profile to attract more customers</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-foreground">{completionPercentage}%</span>
            </div>
          </div>
          <MithoProgress value={completionPercentage} variant="default" size="lg" />
        </MithoCardHeader>
        <MithoCardContent className="p-4 pt-0">
          <div className="space-y-2">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-lg border border-border bg-white p-3"
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span
                  className={`text-sm font-medium flex-1 ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                >
                  {task.label}
                </span>
              </div>
            ))}
          </div>
        </MithoCardContent>
        <MithoCardFooter className="p-4 pt-0">
          <MithoButton
            variant="primary"
            size="sm"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            Complete Profile
          </MithoButton>
        </MithoCardFooter>
      </MithoCard>
    </section>
  )
}
