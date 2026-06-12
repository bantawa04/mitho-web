import { DashboardFooter } from "@/features/dashboard/components/dashboard-footer"
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardBusinessesLoading() {
  return (
    <>
      <DashboardHeader
        businessName="Manage businesses"
        location="Loading your business workspaces"
      />

      <main className="container mx-auto px-4 pb-12 pt-8">
        <section className="mb-8 rounded-lg border border-border bg-surface-business p-6 shadow-sm">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="mt-4 h-12 w-full max-w-3xl rounded-2xl" />
          <Skeleton className="mt-3 h-6 w-full max-w-2xl" />
          <div className="mt-6 flex flex-wrap gap-3">
            <Skeleton className="h-11 w-36 rounded-full" />
            <Skeleton className="h-11 w-40 rounded-full" />
          </div>
        </section>

        <div className="space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-border bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex gap-2">
                    <Skeleton className="h-7 w-28 rounded-full" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </div>
                  <Skeleton className="mt-4 h-8 w-72" />
                  <Skeleton className="mt-2 h-5 w-52" />
                </div>
                <Skeleton className="h-20 w-full rounded-lg sm:w-40" />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
              </div>
              <div className="mt-5 flex gap-3">
                <Skeleton className="h-11 w-36 rounded-full" />
                <Skeleton className="h-11 w-32 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <DashboardFooter />
    </>
  )
}
