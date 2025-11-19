import React from "react"

const Skeleton = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/[0.07] ${className}`}
      {...props}
    />
  )
}

export { Skeleton }
