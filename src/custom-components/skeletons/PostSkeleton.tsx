import { Skeleton } from "@/components/ui/skeleton"

export const PostSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
      <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />
      
      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>

        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-3" />

        {/* Description */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Image placeholder */}
        <Skeleton className="h-48 sm:h-64 w-full rounded-lg mb-4" />

        {/* Footer */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  )
}

export const PostSkeletonList = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  )
}
