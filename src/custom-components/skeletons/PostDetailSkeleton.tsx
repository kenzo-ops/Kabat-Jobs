import { Skeleton } from "@/components/ui/skeleton"

export const PostDetailSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-10 w-32 rounded-lg mb-4" />
      </div>

      {/* Post Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />
        
        <div className="relative p-6 sm:p-8">
          {/* Author info */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>

          {/* Title */}
          <Skeleton className="h-8 w-3/4 mb-4" />

          {/* Description */}
          <div className="space-y-3 mb-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* Image */}
          <Skeleton className="h-96 w-full rounded-xl mb-6" />

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <Skeleton className="h-7 w-40 mb-6" />
        
        {/* Comment input */}
        <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-4 mb-6">
          <Skeleton className="h-20 w-full rounded-lg mb-3" />
          <div className="flex justify-between">
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>

        {/* Comment list */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl p-4"
            >
              <div className="flex items-start gap-3 mb-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
