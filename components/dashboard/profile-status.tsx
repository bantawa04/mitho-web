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
      <h2 className="text-2xl font-bold text-foreground mb-6">Business Profile Status</h2>
      <MithoCard className="border-brand-orange/30">
        <MithoCardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Profile Completion</h3>
              <p className="text-sm text-muted-foreground">Complete your profile to attract more customers</p>
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
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-soft-beige/20 transition-colors"
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
