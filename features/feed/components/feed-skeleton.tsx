export function FeedSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-32 animate-pulse rounded-xl border border-brand-deep-green/10 bg-muted"
        />
      ))}
    </div>
  )
}
