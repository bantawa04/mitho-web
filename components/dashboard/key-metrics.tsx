"use client"

import { Eye, Users, Star, MessageSquare } from "lucide-react"
import { StatCard } from "@/components/ui/mitho-stat-card"

export function KeyMetrics() {
  return (
    <section className="py-8">
      <p className="type-eyebrow mb-3 text-brand-deep-green/70">Overview</p>
      <h2 className="type-section-title mb-6 text-foreground">Key metrics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Eye className="h-6 w-6" />}
          label="Total Profile Views"
          value={2847}
          subtext="Last 30 days"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          icon={<Users className="h-6 w-6" />}
          label="Total Visits"
          value="1.2k"
          subtext="Last 30 days"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard icon={<MessageSquare className="h-6 w-6" />} label="Reviews Count" value={47} subtext="All time" />
        <StatCard icon={<Star className="h-6 w-6" />} label="Average Rating" value={4.6} subtext="Based on reviews" />
      </div>
    </section>
  )
}
