export function SkeletonLoader() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-16 bg-muted rounded-lg" />
        </div>
      ))}
    </div>
  )
}
