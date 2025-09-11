"use client"

interface SessionCardProps {
  title: string
  time: string
  price: string
}

export function SessionCard({ title, time, price }: SessionCardProps) {
  return (
    <div className="bg-teal-600 text-white p-1.5 sm:p-2 rounded text-xs hover:bg-teal-700 transition-colors cursor-pointer">
      <div className="font-medium mb-0.5 sm:mb-1 text-xs sm:text-sm leading-tight">{title}</div>
      <div className="mb-0.5 sm:mb-1 text-xs opacity-90">{time}</div>
      <div className="font-medium text-xs sm:text-sm">{price}</div>
    </div>
  )
}
