import type * as React from "react"

interface DeviceProps {
  children: React.ReactNode
  className?: string
}

export function Device({ children, className }: DeviceProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-center">
        <div className="relative h-[600px] w-72 rounded-[45px] border-8 border-zinc-900 shadow-[0_0_2px_2px_rgba(255,255,255,0.1),0_24px_60px_rgba(0,0,0,0.28)]">
          <div className="absolute left-1/2 top-2 z-20 h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-zinc-900" />
          <div className="pointer-events-none absolute -inset-[1px] rounded-[37px] border-[3px] border-zinc-700/40" />

          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[37px] bg-zinc-900/10">
            {children}
          </div>

          <div className="absolute left-[-12px] top-20 h-8 w-[6px] rounded-l-md bg-zinc-900 shadow-md" />
          <div className="absolute left-[-12px] top-36 h-12 w-[6px] rounded-l-md bg-zinc-900 shadow-md" />
          <div className="absolute left-[-12px] top-52 h-12 w-[6px] rounded-l-md bg-zinc-900 shadow-md" />
          <div className="absolute right-[-12px] top-36 h-16 w-[6px] rounded-r-md bg-zinc-900 shadow-md" />
        </div>
      </div>
    </div>
  )
}
