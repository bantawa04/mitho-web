import Link from "next/link"
import { Users } from "lucide-react"
import { MithoButton } from "@/components/mitho/mitho-button"

export function FeedEmptyState() {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-deep-green/10">
        <Users className="h-6 w-6 text-brand-deep-green" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-brand-dark-green">Your feed is quiet for now</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
        Follow public creators whose reviews and collections feel worth revisiting, and their latest activity will
        show up here.
      </p>
      <div className="mt-5">
        <MithoButton variant="outline-secondary" asChild>
          <Link href="/users">Discover creators</Link>
        </MithoButton>
      </div>
    </div>
  )
}
