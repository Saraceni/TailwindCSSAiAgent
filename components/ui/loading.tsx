import React from "react"

interface LoadingProps {
  size?: "small" | "medium" | "large"
  color?: string
  text?: string
}

export function Loading({ size = "medium", color = "text-blue-600", text }: LoadingProps) {
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 ${color} ${sizeClasses[size]}`}></div>
      {text && <p className={`mt-2 text-sm ${color}`}>{text}</p>}
    </div>
  )
}

