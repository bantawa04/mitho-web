import { Footer } from "@/features/home/components/footer"
import { Header } from "@/features/home/components/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function CategoryLoading() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="bg-background pb-16">
        <div className="container mx-auto px-4 py-5 md:py-6">
          <Skeleton className="h-4 w-48 rounded-full" />

          <div className="mt-5 overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.25fr)_360px]">
              <div className="p-5 md:p-7">
                <Skeleton className="h-9 w-40 rounded-full" />
                <Skeleton className="mt-5 h-3 w-32 rounded-full" />
                <Skeleton className="mt-4 h-10 w-full max-w-3xl rounded-xl" />
                <Skeleton className="mt-3 h-5 w-full max-w-2xl" />
                <Skeleton className="mt-5 h-24 rounded-lg" />

                <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
                  <Skeleton className="h-12 rounded-full" />
                  <Skeleton className="h-12 rounded-full" />
                  <Skeleton className="h-12 rounded-full" />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-28 rounded-lg" />
                  ))}
                </div>
              </div>

              <Skeleton className="min-h-[280px] rounded-none" />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border bg-white px-5 py-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-16 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                <Skeleton className="aspect-[16/10] rounded-none" />
                <div className="space-y-4 p-5">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-lg" />
                    <Skeleton className="h-6 w-24 rounded-lg" />
                  </div>
                  <Skeleton className="h-6 w-44" />
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-white px-5 py-5 shadow-sm">
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="mt-4 h-8 w-full max-w-xl rounded-lg" />
            <div className="mt-5 hidden gap-3 lg:flex">
              <Skeleton className="h-11 w-44 rounded-full" />
              <Skeleton className="h-11 w-40 rounded-full" />
            </div>
            <Skeleton className="mt-5 h-16 rounded-lg" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                  <div className="grid gap-0 md:grid-cols-[240px_minmax(0,1fr)]">
                    <Skeleton className="aspect-[4/3] rounded-none md:h-full" />
                    <div className="space-y-4 p-4 sm:p-5">
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 rounded-lg" />
                        <Skeleton className="h-6 w-24 rounded-lg" />
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-56" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
