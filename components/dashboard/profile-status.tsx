"use client"

import { CheckCircle2, Circle, ArrowRight } from "lucide-react"
import { MithoCard, MithoCardHeader, MithoCardContent, MithoCardFooter } from "@/components/ui/mitho-card"
import { MithoButton } from "@/components/ui/mitho-button"
import { MithoProgress } from "@/components/ui/mitho-progress"

export function ProfileStatus() {
  const completionPercentage = 75
  const tasks = [
    { label: "Add menu items", completed: true },
    { label: "Upload photos", completed: true },
    { label: "Update opening hours", completed: true },
    { label: "Verify location", completed: false },
  ]

  return (
    <section className="py-8">
      <p className="type-eyebrow mb-3 text-brand-deep-green/70">Readiness</p>
      <h2 className="type-section-title mb-6 text-foreground">Business profile status</h2>
      <MithoCard surface="business" interactive="subtle" className="border-brand-orange/20">
        <MithoCardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="type-card-title text-foreground">Profile completion</h3>
              <p className="type-meta">Complete your profile to attract more customers</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-brand-orange">{completionPercentage}%</span>
            </div>
          </div>
          <MithoProgress value={completionPercentage} variant="default" size="lg" />
        </MithoCardHeader>
        <MithoCardContent>
          <div className="space-y-3">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className="surface-business-inset flex items-center gap-3 rounded-[1rem] p-3 transition-colors hover:bg-brand-soft-beige/85"
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
        <MithoCardFooter>
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
