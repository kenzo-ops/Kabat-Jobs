import { Skeleton } from "@/components/ui/skeleton"

export const ProfileInfoSkeleton = () => {
  return (
    <div className="mt-6 grid gap-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-48" />
          </div>
        </div>
      </div>
      
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <Skeleton className="h-3 w-12 mb-2" />
        <Skeleton className="h-6 w-64" />
      </div>

      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-5 w-56" />
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-10 w-full rounded-xl" />
      
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  )
}

export const ProfilePostsSkeleton = () => {
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
        >
          <Skeleton className="aspect-video w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-3 w-20" />
              <div className="flex gap-3">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
