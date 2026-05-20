import { Footer } from "@/components/home/footer"
import { Header } from "@/components/home/header"
import { Skeleton } from "@/components/ui/skeleton"

export default function CategoryLoading() {
  return (
    <div className="page-shell-customer min-h-screen">
      <Header />

      <main className="bg-[linear-gradient(180deg,#fffdf8_0%,#fbf7ee_34%,#fffdfa_100%)] pb-16">
        <div className="container mx-auto px-4 py-10">
          <div className="rounded-[2rem] border border-brand-deep-green/10 bg-white shadow-[0_10px_28px_rgba(10,70,53,0.05)]">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.25fr)_360px]">
              <div className="p-5 md:p-7">
                <Skeleton className="h-12 w-40 rounded-full" />
                <Skeleton className="mt-5 h-4 w-32 rounded-full" />
                <Skeleton className="mt-4 h-12 w-full max-w-3xl rounded-2xl" />
                <Skeleton className="mt-3 h-6 w-full max-w-2xl" />
                <Skeleton className="mt-5 h-28 rounded-[1.4rem]" />

                <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
                  <Skeleton className="h-12 rounded-full" />
                  <Skeleton className="h-12 rounded-full" />
                  <Skeleton className="h-12 rounded-full" />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-10 w-28 rounded-full" />
                  ))}
                </div>
              </div>

              <Skeleton className="min-h-[280px] rounded-none" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-[1.2rem]" />
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="overflow-hidden rounded-[1.6rem] border border-brand-deep-green/10 bg-white">
                <Skeleton className="aspect-[16/10] rounded-none" />
                <div className="space-y-4 p-5">
                  <div className="flex gap-2">
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-28 rounded-full" />
                  </div>
                  <Skeleton className="h-7 w-44" />
                  <Skeleton className="h-20 rounded-[1.25rem]" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.8rem] border border-brand-deep-green/10 bg-white px-5 py-5">
            <Skeleton className="h-4 w-36 rounded-full" />
            <Skeleton className="mt-4 h-10 w-full max-w-xl rounded-2xl" />
            <div className="mt-5 hidden gap-3 lg:flex">
              <Skeleton className="h-11 w-44 rounded-full" />
              <Skeleton className="h-11 w-40 rounded-full" />
              <Skeleton className="h-11 w-44 rounded-full" />
            </div>
            <div className="mt-5 space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="grid gap-0 overflow-hidden rounded-[1.75rem] border border-brand-deep-green/10 bg-white md:grid-cols-[240px_minmax(0,1fr)]">
                  <Skeleton className="aspect-[4/3] rounded-none md:h-full" />
                  <div className="space-y-4 p-5 sm:p-6">
                    <div className="flex gap-2">
                      <Skeleton className="h-7 w-24 rounded-full" />
                      <Skeleton className="h-7 w-28 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-5 w-52" />
                    <div className="grid gap-4 lg:grid-cols-2">
                      <Skeleton className="h-28 rounded-[1.35rem]" />
                      <Skeleton className="h-28 rounded-[1.35rem]" />
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
